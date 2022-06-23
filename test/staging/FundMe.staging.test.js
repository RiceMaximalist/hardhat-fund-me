const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

// only run if not on a development chain
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.002")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })

              const transactionResponse = await fundMe.withdraw({
                  gasLimit: 100000,
              })
              const transactionReceipt = await transactionResponse.wait(1)
              const { gasUsed, effectiveGasPrice } = transactionReceipt
              const gasCost = gasUsed.mul(effectiveGasPrice)

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              const endingDeployerBalance = await fundMe.provider.getBalance(
                  deployer
              )
              console.log(
                  `${endingFundMeBalance.toString()} should equal 0, running assert equal...`
              )
              assert.equal(endingFundMeBalance.toString(), 0)
          })
      })
