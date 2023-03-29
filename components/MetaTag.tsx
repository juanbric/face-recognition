import Head from "next/head";

export const MetaTag = ({ title }: { title: any }) => {
  const description =
    "Trovali es una aplicación que aprovecha el poder de la IA, detección, y reconocimiento facial para optimizar la gestión de fotos de los estudiantes en las escuelas.";
  const image = "https://i.ibb.co/9WLDt6w/Group-64.png";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="distribution" content="Global" />
      <meta name="creator" content="Juan Pablo Briceno" />
      <meta name="publisher" content="Trovali" />
      <link rel="icon" href="https://svgshare.com/i/pdv.svg" />
      {/* <link rel = "canonical" href ={url}/> */}
      <meta http-equiv="content-language" content="es" />

      <meta http-equiv="cache-control" content="no-cache" />
      <meta http-equiv="expires" content="0" />
      <meta http-equiv="pragma" content="no-cache" />

      {/* Twitter */}
      <meta name="twitter:site" content="@juanbrisol" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
    </Head>
  );
};
export default MetaTag;
