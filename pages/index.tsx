import { GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.css';

const contentfulQuery = `{
  redirectCollection {
    items {
      displayName
      url
    }
  }
}`;

interface Link {
  url: string;
  displayName: string;
}

interface HomeProps {
  links: Link[];
}

export default function Home(props: HomeProps): JSX.Element {
  const {links} = props;

  return (
    <div className={styles.container}>
      <Head>
        <title>Bippen's Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Bippen's Links</h1>
      {links.map(({url, displayName}) =>
        <a href={url} target='_blank' rel='noreferrer'>
          {displayName}
        </a>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    body: JSON.stringify({query: contentfulQuery}),
  });
  const {data} = await res.json();
  const links = data?.redirectCollection?.items;
  return { props: {links} };
}
