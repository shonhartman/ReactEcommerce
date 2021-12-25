import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import 'dotenv/config';
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";

import { withItemData,
  statelessSessions } from '@keystone-next/keystone/session';

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
    url: databaseURL
    // TODO : add data seeding here
  },
  lists: createSchema({
    User,
    Product,
    ProductImage,
    // Schema items should go here
  }),
  ui: {
    // Show the UI only to someone who passes this test
    isAccessAllowed: ({ session }) => { 
      console.log( session );
      return !!session?.data;
    },
  },
  session: withItemData(statelessSessions(sessionConfig), {
    User: `id`
  })
}
));