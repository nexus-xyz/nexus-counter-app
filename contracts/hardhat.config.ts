import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const NEXUS_RPC = process.env.NEXUS_RPC_URL || "";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    nexus: {
      url: NEXUS_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 392,
    },
  },
};

export default config;
