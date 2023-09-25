import Head from "next/head";

type TwitterCardType = "summary" | "summary_large_image" | "app" | "player";

export interface HeadMetaProps {
  siteName?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  /**
   * Object Types: https://ogp.me/#types
   */
  type?: string;
  twitterCardType?: TwitterCardType;
}

const HeadMetaData = ({
  siteName = "Wrapped Punks",
  title = "Wrapped Punks",
  description = "Turn your CryptoPunks into ERC721",
  twitterCardType = "summary_large_image",
  type,
}: HeadMetaProps) => {
  return (
    <Head>
      <link rel="icon" href={`/favicon.ico`} />
      <link
        rel="apple-touch-icon"
        type="image/png"
        sizes="180x180"
        href={`/apple-touch-icon.png`}
        crossOrigin="use-credentials"
      />
      <link
        rel="apple-touch-startup-image"
        type="image/png"
        sizes="180x180"
        href={`/apple-touch-icon.png`}
        crossOrigin="use-credentials"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`/favicon-32x32.png`}
        crossOrigin="use-credentials"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`/favicon-16x16.png`}
        crossOrigin="use-credentials"
      />
      <link
        rel="manifest"
        href={`/manifest.json`}
        crossOrigin="use-credentials"
      />

      <meta name="apple-mobile-web-app-status-bar" content="#ffffff" />

      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* OpenGraph tags */}
      <meta
        key="og:title"
        name="og:title"
        property="og:title"
        content={title}
      />
      <meta
        key="og:description"
        name="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:type" name="og:type" property="og:type" content={type} />

      <meta
        key="og:image:alt"
        name="og:image:alt"
        property="og:image:alt"
        content={siteName}
      />
      <meta
        key="og:site_name"
        name="og:site_name"
        property="og:site_name"
        content={siteName}
      />

      {/* Twitter Tags */}
      <meta
        key="twitter:card"
        name="twitter:card"
        property="twitter:card"
        content={twitterCardType}
      />
      <meta
        key="twitter:title"
        name="twitter:title"
        property="twitter:title"
        content={title}
      />
      <meta
        key="twitter:description"
        name="twitter:description"
        property="twitter:description"
        content={description}
      />
      <meta
        key="twitter:image:alt"
        name="twitter:image:alt"
        property="twitter:image:alt"
        content={siteName}
      />

      <title>{title}</title>
    </Head>
  );
};

export default HeadMetaData;
