/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';
import NProgress from 'nprogress';
import Router from 'next/router';
import '../components/styles/nprogress.css';
import Page from '../components/Page';
import withData from '../lib/withData';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

App.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

App.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  pageProps: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  apollo: PropTypes.any,
};

export default withData(App);
