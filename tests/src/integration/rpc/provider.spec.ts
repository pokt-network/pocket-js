/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Network Provider interface
 */
import * as dotenv from "dotenv"
import { expect } from "chai"
import { EnvironmentHelper, Network } from "../../../utils/env/helper"
import {
    Configuration, HttpRpcProvider, Pocket, typeGuard, RpcError, PocketRpcProvider, PocketAAT, V1RPCRoutes, Account, QueryAccountResponse, QueryBlockResponse,
} from "../../../../src"

// Constants
// For Testing we are using dummy data, none of the following information is real.
const addressHex = "175090018C3796FA05F4C0120EC61E2BBDA523F6"
const pocketBlockchain = "0002"
const blockchains = [pocketBlockchain]
const nodeAddress = "20421fe2cbfbd7fc7f120a1d8eb7bc223cfcf2d5"

/** Specify the environment using using EnvironmentHelper.getLocalNet()
 * LocalNet will run the tests againt's a local network which can be setup in the .env file = localhost_env_url="http://35.245.7.53"
 * TestNet will run the tests with the TestNet Network.
 * MainNet will run the tests with the MainNet Network (not available yet).
 * 
 * Note: Can be done also using the Network enum (LocalNet,TestNet and MainNet)
 * EnvironmentHelper.get(Network.LocalNet)
 * Note: process.env.localhost_env_url is set in the .env file, add if it doesn't exist in the root directory of the project
 * To use unit tests run "npm run test:unit" or "npmtest", for integration run "npm run test:integration"
 */
dotenv.config()
const env = EnvironmentHelper.getLocalNet()
const dispatcher = new URL(env.getPOKTRPC())
const configuration = new Configuration(5, 1000, 5, 40000, true, undefined, undefined, undefined, undefined, false)

//
const clientPubKeyHex = "6220b1e1364c4f120914d80000b63bdac6a58fc3dbb2ff063bcfcb4f8915a49b"
const clientPrivateKey = "c86b5424ab1d73da92522d21adbd48b217a66b61f78fa8e2c93e9ea47afa55716220b1e1364c4f120914d80000b63bdac6a58fc3dbb2ff063bcfcb4f8915a49b"
const walletAppPublicKey = "a7e8ec112d0c7bcb2521fe783eac704b874a148541f9e9d43bbb9f831503abea"
const walletAppAATSignature = "7949373c02eff36a87a2b847319a804eaed5f664c8333a3cb6c3ad14dbe98380ef1c53bee321e95670b123a1c4993ce02f130a98ec00ea6cac926a410b5f920f"
const clientPassphrase = "123"
const blockchain = "0002"

// Create AAT
const aat = new PocketAAT(
    "0.0.1",
    clientPubKeyHex,
    walletAppPublicKey,
    walletAppAATSignature
)


// Default pocket instance to reuse code
async function getPocketDefaultInstance(): Promise<Pocket> {
    return new Pocket([dispatcher], undefined, configuration)
}

function getPocketRpcProvider(pocket: Pocket, aat: PocketAAT, consensusEnabled: boolean): PocketRpcProvider {
    const pocketRpcProvider = new PocketRpcProvider(
        pocket,
        aat,
        blockchain,
        consensusEnabled
    )
    return pocketRpcProvider
}
async function getPocketWithPocketRpcProviderInstance(consensusEnabled: boolean = false): Promise<Pocket> {
    const pocket = await getPocketDefaultInstance()
    // Import Client Account
    const clientAccountOrError = await pocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), clientPassphrase)
    const clientAccount = clientAccountOrError as Account
    // Unlock client account
    const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)

    const pocketRpcProvider = getPocketRpcProvider(pocket, aat, consensusEnabled)
    return new Pocket([dispatcher], pocketRpcProvider, configuration)
}

describe("Pocket Provider Query Interface", async () => {
    describe("Success scenarios", async () => {

        it('should successfully retrieve an account information', async () => {
            const pocket = await getPocketDefaultInstance()

            const clientAccountOrError = await pocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            
            const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined
            
            const provider = new PocketRpcProvider(pocket, aat, pocketBlockchain)
            const payload = JSON.stringify({ address: "19c0551853f19ce1b7a4a1ede775c6e3db431b0f" })
            const accountResponse = await provider.send(V1RPCRoutes.QueryAccount.toString(), payload)
            expect(typeGuard(accountResponse, "string")).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account information using the rpc query call', async () => {
            const pocket = await getPocketWithPocketRpcProviderInstance()
            const providerBefore = pocket.rpc
            const accountResponse = await pocket.rpc()!.query.getAccount("0594a790e92d423e565652ae16678f3329ec9985")
            const providerAfter = pocket.rpc
            expect(typeGuard(accountResponse, QueryAccountResponse)).to.be.true
            expect(providerBefore).to.be.equal(providerAfter)
        }).timeout(0)

        it('should successfully retrieve an block information using the rpc query call', async () => {
            const pocket = await getPocketWithPocketRpcProviderInstance()
            const providerBefore = pocket.rpc
            const accountResponse = await pocket.rpc()!.query.getBlock(BigInt(9))
            const providerAfter = pocket.rpc
            expect(typeGuard(accountResponse, QueryBlockResponse)).to.be.true
            expect(providerBefore).to.be.equal(providerAfter)
        })

        it('should successfully retrieve an account information with consensus enabled', async () => {
            const pocket = await getPocketWithPocketRpcProviderInstance(true)
            const providerBefore = pocket.rpc
            const accountResponse = await pocket.rpc()!.query.getAccount("0594a790e92d423e565652ae16678f3329ec9985")
            const providerAfter = pocket.rpc
            expect(typeGuard(accountResponse, QueryAccountResponse)).to.be.true
            expect(providerBefore).to.be.equal(providerAfter)
        }).timeout(0)

        it('should successfully retrieve an block information with consensus enabled', async () => {
            const pocket = await getPocketWithPocketRpcProviderInstance(true)
            const providerBefore = pocket.rpc
            const accountResponse = await pocket.rpc()!.query.getBlock(BigInt(9))
            const providerAfter = pocket.rpc
            expect(typeGuard(accountResponse, QueryBlockResponse)).to.be.true
            expect(providerBefore).to.be.equal(providerAfter)
        })
    })
    describe("Error scenarios", async () => {
        it('should returns an error trying to get a block due block height lower than 0.', async () => {
            const pocket = await getPocketWithPocketRpcProviderInstance()
            
            const blockResponse = await pocket.rpc()!.query.getBlock(BigInt(-1))
            expect(typeGuard(blockResponse, RpcError)).to.be.true
        }).timeout(0)
    })
})