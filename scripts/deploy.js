const hre = require('hardhat');

async function main() {
  const Youtube = await hre.ethers.getContractFactory('Youtube');
  const youtube = await Youtube.deploy();
  await youtube.deployed();

  console.log(`Youtube deployed to ${youtube.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
