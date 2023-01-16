import Head from "next/head";

export const MetaTag = ({ title }: { title: any }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="Aplicación de detección y reconocimiento facial"
      />
      <meta name="distribution" content="Global" />
      <meta name="creator" content="Juan Pablo Briceno" />
      <meta name="publisher" content="Zentra Dev" />
      <link rel="icon" href="https://i.postimg.cc/rpCZS13d/logo.png" />
      <meta http-equiv="content-language" content="es" />
      <meta http-equiv="cache-control" content="no-cache" />
      <meta http-equiv="expires" content="0" />
      <meta http-equiv="pragma" content="no-cache" />
    </Head>
  );
};
export default MetaTag;
