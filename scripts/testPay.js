const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const PaymentProcessor = await hre.ethers.getContractFactory("PaymentProcessor");
  const contract = await PaymentProcessor.attach(contractAddress);

  console.log("Calling pay function...");
  const tx = await contract.pay({ value: hre.ethers.utils.parseEther("1") });
  await tx.wait();
  console.log("Payment successful!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
