import Head from 'next/head';

const OpenGraphElements: React.FC<{
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}> = props => {
  let { title, description, imageUrl } = props;

  if (!title) {
    title = 'ENS Small Grants';
  }

  if (!description) {
    description = 'Vote on projects to receive funding from ENS DAO Working Groups.';
  }

  if (!imageUrl) {
    imageUrl = 'https://ensgrants.xyz/sharing.jpg';
  }

  return (
    <Head>
      {/* SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* <!-- Twitter --> */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};
export default OpenGraphElements;
