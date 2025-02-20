import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: {
      nexus: "empty"
    },
    customChains: [
      {
        network: "nexus",
        chainId: 392,
        urls: {
          apiURL: "https://explorer.nexus.xyz/api",
          browserURL: "https://explorer.nexus.xyz"
        }
      }
    ]
  },
  networks: {
    nexus: {
      url: "https://rpc.nexus.xyz/",
      accounts: [PRIVATE_KEY],
      chainId: 392
    }
  }
};

export default config;