import Head from 'next/head'

export const MetaTag = ({
  title,
  description,
}: {
  title: any
  description: any
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="distribution" content="Global" />
      <meta name="creator" content="Juan Pablo Briceno" />
      <meta name="publisher" content="Zentra Dev" />
      <link rel="icon" href="https://i.postimg.cc/rpCZS13d/logo.png" />
      <meta http-equiv="content-language" content="es" />
    </Head>
  )
}
export default MetaTag