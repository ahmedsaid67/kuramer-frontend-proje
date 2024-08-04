import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../styles/globals.css'
import Layout from '../compenent/Layout';
import Head from 'next/head';
import { wrapper } from '../context/provider';
import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import '@fortawesome/fontawesome-svg-core/styles.css'; // fontawesome-svg-core için gerekli CSS



const ROUTES_TO_RETAIN = ["/"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const retainedReduxState = useRef(null);

  const isRetainableRoute = ROUTES_TO_RETAIN.includes(
    router.asPath === "/" ? "/index" : router.asPath
  );

  useEffect(() => {
    if (isRetainableRoute) {
      retainedReduxState.current = pageProps; 
    }
  }, [pageProps, isRetainableRoute]);

  return (
    <>



      <Layout>
        {isRetainableRoute && retainedReduxState.current && (
          <Component {...retainedReduxState.current} />
        )}
        {!isRetainableRoute && <Component {...pageProps} />}
      </Layout>
      </>
   
  );
}



export default wrapper.withRedux(MyApp);

