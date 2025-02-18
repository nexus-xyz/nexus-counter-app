import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    nexus: {
      url: "https://rpc.nexus.xyz/http",
      accounts: [PRIVATE_KEY],
      chainId: 392
    }
  }
};

export default config;