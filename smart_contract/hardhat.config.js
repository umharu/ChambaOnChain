require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",

  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/_gIOj18pzzM6XYGrMvyp9',
      accounts: ['81e51924d018cbe527c55e404169d1281d79d89b21483ccf6be102a71be2f5d5'],
    },}
};
