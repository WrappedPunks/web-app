 # Wrapped Punks Front-End

 This is the front-end repository for the Wrapped Punks website, an application used to wrap and unwrap CryptoPunks.

 ## Table of Contents
- [Wrapped Punks Front-End](#wrapped-punks-front-end)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Scripts](#scripts)
  - [Dependencies](#dependencies)
  - [Development Dependencies](#development-dependencies)
  - [Environment Variables](#environment-variables)
  - [Important Note](#important-note)

 ## Getting Started

 To get started with the Wrapped Punks front-end project, follow these steps:

 1. Clone this repository to your local machine.

 ```
 git clone https://github.com/WrappedPunks/web-app.git
 ```

 2. Install the project dependencies.

 ```
 yarn install
 ```

 3. Start the development server.

 ```
 yarn dev
 ```

 The development server should now be running, and you can access the application in your browser at `http://localhost:3000`.

 ## Scripts

 The following scripts are available for managing the project:

 - `yarn dev`: Start the development server.
 - `yarn build`: Build the production-ready application.
 - `yarn start`: Start the production server.
 - `yarn lint`: Lint the codebase.

 ## Dependencies

 The project relies on several dependencies, including but not limited to:

 - React
 - Next.js
 - Chakra UI
 - Emotion
 - React Query
 - TypeScript
 - Wagmi
 - Viem

 You can find the complete list of dependencies and their versions in the `package.json` file.

 ## Development Dependencies

 Development dependencies include tools for linting and code formatting:

 - ESLint
 - Prettier
 - TypeScript ESLint

 These tools help maintain code quality and consistency throughout the project.

 ## Environment Variables

 The project uses environment variables for configuration. Create a `.env` file in the root directory with the following content:

 ```
 NEXT_PUBLIC_CONTRACT_ADDRESS_CRYPTO_PUNKS_MAINNET=0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB
 NEXT_PUBLIC_CONTRACT_ADDRESS_WRAPPED_PUNKS_MAINNET=0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6
 NEXT_PUBLIC_CONTRACT_ADDRESS_CRYPTO_PUNKS_GOERLI=0x36acA719211384627c22aaBA17b6eD013Cc144ca
 NEXT_PUBLIC_CONTRACT_ADDRESS_WRAPPED_PUNKS_GOERLI=0x33b8adFdF4DDc3ee3c239D5E0cB511bb5fb647D4
 NEXT_PUBLIC_IS_CONNECTION_DISABLED=false
 ```

 For production, create a `.env.production` file with the following content:

 ```
 NEXT_PUBLIC_ENV=production
 NEXT_PUBLIC_NETWORK=mainnet
 NEXT_PUBLIC_ALCHEMY_ETHEREUM_API_KEY=XXXX
 NEXT_PUBLIC_S3_HOST=https://images.wrappedpunks.com
 ```

 Replace `XXXX` with your actual Alchemy Ethereum API key.

 ## Important Note

 This README provides an overview of the Wrapped Punks front-end repository. Be sure to keep your dependencies up to date and follow best practices for React and Next.js development.
