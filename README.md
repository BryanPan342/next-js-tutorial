# Next.js Tutorial

This repository is a tutorial repository. At the end of everything, we will create
a tinyurl system with a CMS (contentful) and Next.js.

## Getting Started

First, we need to have `node.js` as a runtime for Javascript. I like to use `nvm`
to manage my node version.

Go to [nvm](https://github.com/nvm-sh/nvm#install--update-script) to install nvm.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# In your profile file (~/.bashrc, ~/.zshrc) add the following

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# Run the following to verify nvm is installed
nvm --version
```

Now we want to install `node`, run the following:

```sh
nvm install node
node --version
```

I prefer using `yarn` as my package manager. Read up on why we use `yarn` and what a
package manager does [here](https://github.com/UCLA-Creative-Labs/internal-docs/blob/main/Frontend/README.md#package-management).

```
npm install -g yarn
```

## Create Next App

Now let's create our `next.js` app. We can do that easily with the following command:

```sh
npx create-next-app --ts
# or
yarn create next-app --typescript

cd [app-name]
```

## Display your links

Set your homepage to query for contentful links. Set your `pages/index.tsx` file to:

```ts
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
```

## Clean Up

Now let's clean up some stuff in this repository..

Let's delete the following:

* `/pages/api`
* `/public/vercel.svg`

Replace the `Home.module.css` file with the following contents:

```css
.container {
  height: 100%;
  width: 100%;
  padding: 40px 40px;
  display: flex;
  flex-direction: column;
}
```

## Create Redirection

```sh
yarn add -D dotenv

# Add the following to your package manager scripts
# package.json
{
  "scripts": {
    "prebuild": "node scripts/prebuild.js",
    ...
  }
}

# gitignore generated files
# .gitignore
_redirects
```

With the contents of your prebuild file as the following:

```js
const { writeFileSync } = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({path: `${__dirname}/../.env.local`});

const contentfulQuery = `{
  redirectCollection {
    items {
      url
      redirectPath
    }
  }
}`;

const main = async () => {
  const contentfulRes = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query: contentfulQuery }),
  });
  const {data} = await contentfulRes.json();
  const redirects = data.redirectCollection.items.reduce((acc, {redirectPath, url}) => {
    return `${acc}/${redirectPath} ${url}\n`;
  }, '');
  writeFileSync(path.resolve(__dirname, '../_redirects'), redirects);
}

main();
```
