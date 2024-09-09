import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";
import "./scripts/compile/compileSpecific";




// Import the custom task


// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "";

// Configuration for different networks
const localNetworks = {
  localhost: {
    url: "http://127.0.0.1:8545",
  },
  hardhat: {
    forking: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      enabled: process.env.MAINNET_FORKING_ENABLED === "true",
    },
  },
};

const testnetNetworks = {
  sepolia: {
    url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  minato: {
    url: `https://rpc.minato.soneium.org/`,
    accounts: [deployerPrivateKey],
  },
  arbitrumSepolia: {
    url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  optimismSepolia: {
    url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  polygonMumbai: {
    url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  polygonZkEvmTestnet: {
    url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  scrollSepolia: {
    url: "https://sepolia-rpc.scroll.io",
    accounts: [deployerPrivateKey],
  },
  pgnTestnet: {
    url: "https://sepolia.publicgoods.network",
    accounts: [deployerPrivateKey],
  },
  zoraSepolia: {
    url: "https://sepolia.rpc.zora.energy",
    accounts: [deployerPrivateKey],
  },
  liskSepolia: {
    url: "https://rpc.sepolia-api.lisk.com",
    accounts: [deployerPrivateKey],
  },
  modeSepolia: {
    url: "https://sepolia.mode.network",
    accounts: [deployerPrivateKey],
  },
};

const mainnetNetworks = {
  mainnet: {
    url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  arbitrum: {
    url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  optimism: {
    url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  polygon: {
    url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  polygonZkEvm: {
    url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  gnosis: {
    url: "https://rpc.gnosischain.com",
    accounts: [deployerPrivateKey],
  },
  chiado: {
    url: "https://rpc.chiadochain.net",
    accounts: [deployerPrivateKey],
  },
  base: {
    url: `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`,
    accounts: [deployerPrivateKey],
  },
  scroll: {
    url: "https://rpc.scroll.io",
    accounts: [deployerPrivateKey],
  },
  pgn: {
    url: "https://rpc.publicgoods.network",
    accounts: [deployerPrivateKey],
  },
  zora: {
    url: "https://rpc.zora.energy",
    accounts: [deployerPrivateKey],
  },
  mode: {
    url: "https://mainnet.mode.network",
    accounts: [deployerPrivateKey],
  },
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    ...localNetworks,
    ...testnetNetworks,
    ...mainnetNetworks,
  },
 
};

export default config;
