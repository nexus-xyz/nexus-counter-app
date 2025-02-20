import { ethers, run } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // 環境変数からの読み込み
  const name = process.env.NFT_NAME || "LuckyCounter";
  const symbol = process.env.NFT_SYMBOL || "LUCKY";
  const rewardChance = 3; // 3%に固定
  const nexusChainId = parseInt(process.env.NEXUS_CHAIN_ID || "392");

  console.log("Deploying LuckyCounter with parameters:");
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Initial Reward Chance: ${rewardChance}%`);
  console.log(`Chain ID: ${nexusChainId}`);
  console.log(`Ticket Price: 0.01 NEX`);

  // コントラクトのファクトリを取得
  const LuckyCounter = await ethers.getContractFactory("LuckyCounter");

  // コントラクトをデプロイ
  console.log("Deploying contract...");
  const counter = await LuckyCounter.deploy(name, symbol, rewardChance, nexusChainId);
  console.log("Waiting for deployment...");
  await counter.waitForDeployment();
  const contractAddress = await counter.getAddress();
  console.log(`LuckyCounter deployed to: ${contractAddress}`);

  // コントラクトを検証
  console.log("Waiting for 5 blocks before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [name, symbol, rewardChance, nexusChainId],
    });
    console.log("Verification completed ✅");
  } catch (error) {
    console.error("Verification failed ❌", error);
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
