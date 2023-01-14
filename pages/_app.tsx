import type { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "../components/Layout";
//@ts-ignore
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Layout>
      <ChakraProvider>
          <Component {...pageProps} />
      </ChakraProvider>
    </Layout>
  );
}
