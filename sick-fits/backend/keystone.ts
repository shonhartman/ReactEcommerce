import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import 'dotenv/config';
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { withItemData,
  statelessSessions } from '@keystone-next/keystone/session';
import { insertSeedData } from './seed-data';
import { CartItem } from './schemas/CartItem';
import { sendPasswordResetEmail } from './lib/mail';

const databaseURL =  process.env.DATABASE_URL || 'mongodb://localhost/keyston-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 100 * 360, // how long they will stay signed in
  secret: process.env.COOKIE_SECRET, 
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO : add in initial roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    }
  }
})

export default withAuth(config({
  // @ts-ignore
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    async onConnect(keystone) {
      if(process.argv.includes('--seed-data')) {
        await insertSeedData(keystone);    
      }
    }
  },
  lists: createSchema({
    User,
    Product,
    ProductImage,
    CartItem
  }),
  ui: {
    // Show the UI only to someone who passes this test
    isAccessAllowed: ({ session }) => { 
      return !!session?.data;
    },
  },
  session: withItemData(statelessSessions(sessionConfig), {
    User: `id`
  })
}
));