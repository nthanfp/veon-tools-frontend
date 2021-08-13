import HeadNext from 'next/head';

const Head = (props) => {
  const { title } = props;
  return (
    <HeadNext>
      <title>{title} - Veon Tools</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </HeadNext>
  );
};

export default Head;
