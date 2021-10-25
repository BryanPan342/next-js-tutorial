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
