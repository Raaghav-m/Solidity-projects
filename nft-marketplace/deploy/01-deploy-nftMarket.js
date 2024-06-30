const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("@nomiclabs/hardhat-etherscan")

module.exports = async function ({ getNamedAccounts, deployments }) {
    let { deploy, log } = await deployments
    let { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS
    log("------------------------------------------------")

    let arguments = []

    log("------------------------------------------")
    let nftMarketplace = await deploy("NftMarket", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("Deployed ------------------------------------------")
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(nftMarketplace.address, arguments)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "main"]
