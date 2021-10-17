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
