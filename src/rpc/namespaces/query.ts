import { IRPCProvider } from "../providers"
import { typeGuard, Hex } from "../.."
import { QueryBlockResponse, RpcError, V1RPCRoutes, QueryTXResponse, QueryHeightResponse, QueryBalanceResponse, QueryNodeResponse, QueryNodeParamsResponse, QueryNodeReceiptsResponse, NodeReceipt, QueryNodeReceiptResponse, QueryAppsResponse, QueryAppResponse, QueryAppParamsResponse, QueryPocketParamsResponse, QuerySupportedChainsResponse, QuerySupplyResponse, QueryAccountResponse, StakingStatus } from ".."
import { ChallengeRequest } from "../models/input/challenge-request"
import { ChallengeResponse } from "../models/output/challenge-response"
import { QueryAccountTxsResponse } from "../models/output/query-account-txs-response"
import { JailedStatus } from "../models/jailed-status"
import { QueryNodesResponse, QueryAllParamsResponse, QueryUpgradeResponse } from "../models"
import { QueryBlockTxsResponse } from "../models/output/query-block-txs-response"
import { QueryNodeClaimResponse } from "../models/output/query-node-claim-response"
import { QueryNodeClaimsResponse } from "../models/output/query-node-claims-response"

export class QueryNamespace {
    public readonly rpcProvider: IRPCProvider
    /**
     * @description Query namespace class
     * @param {IRPCProvider} rpcProvider - RPC Provider interface object.
     */
    public constructor(rpcProvider: IRPCProvider) {
        this.rpcProvider = rpcProvider
    }

    /**
     *
     * Query a Block information
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getBlock(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryBlockResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }
            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryBlock.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )
            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryBlockResponse = QueryBlockResponse.fromJSON(
                    response
                )
                return queryBlockResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the block information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Query a Block transaction list
     * @param {BigInt} blockHeight - Block's number.
     * @param {boolean} prove - True or false to include the tx proof.
     * @param {number} page - Page number, default 1.
     * @param {number} perPage - Records count per page, default 30.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getBlockTxs(
        blockHeight: BigInt = BigInt(0),
        prove: boolean = false,
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryBlockTxsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }
            const payload = JSON.stringify(
                {
                    height: Number(blockHeight.toString()),
                    prove: prove,
                    page: page,
                    per_page: perPage
                }
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryBlockTxs.toString(),
                payload,
                timeout,
                rejectSelfSignedCertificates
            )
            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryBlockTxsResponse = QueryBlockTxsResponse.fromJSON(
                    response
                )
                return queryBlockTxsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the block information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves a transaction information
     * @param {string} txHash - Transaction hash.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getTX(
        txHash: string,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryTXResponse | RpcError> {
        try {
            if (!Hex.isHex(txHash) && Hex.byteLength(txHash) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({ hash: txHash })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryTX.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryTXResponse = QueryTXResponse.fromJSON(
                    response
                )
                return queryTXResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the block information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Get the current network block height
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getHeight(
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryHeightResponse | RpcError> {
        try {
            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryHeight.toString(),
                "",
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryHeightResponse = QueryHeightResponse.fromJSON(
                    response
                )
                return queryHeightResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the network block height: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves an account balance
     * @param {string} address - Account's address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getBalance(
        address: string,
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryBalanceResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({ "address": address, "height": Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryBalance.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryBalanceResponse = QueryBalanceResponse.fromJSON(
                    response
                )
                return queryBalanceResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve current balance: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves a list of validator nodes
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {JailedStatus} jailedStatus - Jailed status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {string} blockchain - (optional) Blockchain Identifier.
     * @param {number} page - (optional) Page number, default 1.
     * @param {number} perPage - (optional) Records count per page, default 30.
     * @param {number} timeout - (optional) Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getNodes(
        stakingStatus: StakingStatus = StakingStatus.NA,
        jailedStatus: JailedStatus = JailedStatus.NA,
        blockHeight: BigInt = BigInt(0),
        blockchain: string = "",
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryNodesResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({
                height: Number(blockHeight.toString()),
                opts: {
                    staking_status: stakingStatus === "" ? null : stakingStatus,
                    jailed_status: jailedStatus === "" ? null : jailedStatus,
                    blockchain: blockchain,
                    page: page,
                    per_page: perPage
                }
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodes.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodesResponse = QueryNodesResponse.fromJSON(
                    response
                )
                return queryNodesResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve a list of validator nodes: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Query a Node information
     * @param {string} address - Node address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getNode(
        address: string,
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryNodeResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({
                address: address,
                height: Number(blockHeight.toString())
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNode.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodeResponse = QueryNodeResponse.fromJSON(
                    response
                )
                return queryNodeResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the node params
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getNodeParams(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryNodeParamsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeParams.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodeParamsResponse = QueryNodeParamsResponse.fromJSON(
                    response
                )
                return queryNodeParamsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node params information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the node receipts information
     * @param {string} address - Node's address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getNodeReceipts(
        address: string,
        blockHeight: BigInt = BigInt(0),
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryNodeReceiptsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            if (!Hex.validateAddress(address)) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({
                address: address,
                height: Number(blockHeight.toString()),
                page: page,
                per_page: perPage
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeReceipts.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodeReceiptsResponse = QueryNodeReceiptsResponse.fromJSON(
                    response
                )
                return queryNodeReceiptsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node receipts: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the node receipt information
     * @param {string} address - Node's address.
     * @param {string} appPubKey - Node's address.
     * @param {string} blockchain - Node's address.
     * @param {BigInt} height - Node's address.
     * @param {BigInt} sessionBlockHeight - Node's address.
     * @param {string} receiptType - Node's address.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getNodeReceipt(
        address: string,
        appPubKey: string,
        blockchain: string,
        height: BigInt,
        sessionBlockHeight: BigInt,
        receiptType : string,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryNodeReceiptResponse | RpcError> {
        try {
            const nodeReceipt = new NodeReceipt(address, blockchain, appPubKey, sessionBlockHeight, height, receiptType)

            if (!nodeReceipt.isValid()) {
                return new RpcError("0", "Invalid Node Receipt information")
            }

            const payload = nodeReceipt.toJSON()

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeReceipt.toString(),
                JSON.stringify(payload),
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const queryNodeReceiptResponse = QueryNodeReceiptResponse.fromJSON(
                    response
                )
                return queryNodeReceiptResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node receipt: " + response.message
                )
            }
        } catch (err) {
            return err
        }
    }
    /**
     *
     * Retrieves a list of apps
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {string} blockchain - (optional) Blockchain identifier.
     * @param {BigInt} page - (optional) Block's number.
     * @param {BigInt} perPage - (optional) Block's number.
     * @param {number} timeout - (optional) Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getApps(
        stakingStatus: StakingStatus = StakingStatus.NA,
        blockHeight: BigInt = BigInt(0),
        blockchain: string = "",
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryAppsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({
                height: Number(blockHeight.toString()),
                opts: {
                    staking_status: stakingStatus === "" ? null : stakingStatus,
                    blockchain: blockchain,
                    page: page,
                    per_page: perPage
                }
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryApps.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAppsResponse = QueryAppsResponse.fromJSON(
                    response
                )
                return queryAppsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the list of apps: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves an app information
     * @param {string} address - Address of the app.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getApp(
        address: string,
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryAppResponse | RpcError> {
        try {
            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({
                address: address,
                height: Number(blockHeight.toString())
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryApp.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAppResponse = QueryAppResponse.fromJSON(
                    response
                )
                return queryAppResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the app infromation: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves app params.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getAppParams(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryAppParamsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryAppParams.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAppParamsResponse = QueryAppParamsResponse.fromJSON(
                    response
                )
                return queryAppParamsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the app params: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the pocket params.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getPocketParams(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryPocketParamsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryPocketParams.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const queryPocketParamsResponse = QueryPocketParamsResponse.fromJSON(
                    response
                )
                return queryPocketParamsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the pocket params: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves supported chains
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getSupportedChains(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QuerySupportedChainsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QuerySupportedChains.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const querySupportedChainsResponse = QuerySupportedChainsResponse.fromJSON(
                    response
                )
                return querySupportedChainsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supported chains list: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }

    /**
     *
     * Retrieves current supply information
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getSupply(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QuerySupplyResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify(
                {
                    height: Number(blockHeight.toString())
                }
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QuerySupply.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const querySupplyResponse = QuerySupplyResponse.fromJSON(
                    response
                )
                return querySupplyResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }

    /**
     *
     * Retrieves current Account information
     * @param {string} address - Account's address.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getAccount(
        address: string,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryAccountResponse | RpcError> {
        try {
            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({ address: address })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryAccount.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAccountResponse = QueryAccountResponse.fromJSON(
                    response
                )
                return queryAccountResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the account information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves an account transaction list
     * @param {string} address - Account's address.
     * @param {boolean} received - Filters for received or sent txs.
     * @param {boolean} prove - True or false to include the tx proof.
     * @param {number} page - (optional) Page number, default 1.
     * @param {number} perPage - (optional) Records count per page, default 30.
     * @param {number} timeout - (optional) Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getAccountTxs(
        address: string,
        received: boolean,
        prove: boolean,
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryAccountTxsResponse | RpcError> {
        try {
            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify(
                {
                    address: address,
                    prove: prove,
                    received: received,
                    page: page,
                    per_page: perPage
                }
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryAccountTxs.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAccountTxsResponse = QueryAccountTxsResponse.fromJSON(
                    response
                )
                return queryAccountTxsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     * Returns the list of all pending claims submitted by node address at height,  height = 0 is used as latest
     * @param {string} address - Node's address.
     * @param {BigInt} appPubKey - Application public key.
     * @param {nuber} blockchain - Blockchain hash.
     * @param {nuber} height - Block height.
     * @param {nuber} sessionBlockHeight - Session block height.
     * @param {nuber} receiptType - Receipt type, can be "relay" or "challenge".
     * @param {nuber} timeout - (Optional) Request timeout value, default 60000.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getNodeClaim(
        address: string,
        appPubKey: string,
        blockchain: string,
        height: BigInt,
        sessionBlockHeight: BigInt,
        receiptType: string,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryNodeClaimResponse | RpcError> {
        try {
            // Create a node receipt object
            const nodeReceipt = new NodeReceipt(address, blockchain, appPubKey, sessionBlockHeight, height,receiptType)

            const payload = JSON.stringify(
                nodeReceipt.toJSON()
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeClaim.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodeClaimResponse = QueryNodeClaimResponse.fromJSON(
                    response
                )
                return queryNodeClaimResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     * Returns the node pending claim for specific session
     * @param {string} address - Node's address.
     * @param {BigInt} height - Block height.
     * @param {nuber} page - (Optional) Page number, default 1.
     * @param {nuber} perPage - (Optional) Per page amount of records, default 30.
     * @param {nuber} timeout - (Optional) Request timeout value, default 60000.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getNodeClaims(
        address: string,
        height: BigInt,
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryNodeClaimsResponse | RpcError> {
        try {

            if (!Hex.validateAddress(address)) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify(
                {
                    address: address,
                    height: Number(height.toString()),
                    page: page,
                    per_page: perPage
                }
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeClaims.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodeClaimsResponse = QueryNodeClaimsResponse.fromJSON(
                    response
                )
                return queryNodeClaimsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     * Returns the node parameters at the specified height,  height = 0 is used as latest
     * @param {nuber} height - Block height.
     * @param {nuber} timeout - (Optional) Request timeout value, default 60000.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async getAllParams(
        height: BigInt,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryAllParamsResponse | RpcError> {
        try {
            
            if (Number(height.toString()) < 0) {
                return new RpcError("0", "Block height can't be lower than 0")
            }

            const payload = JSON.stringify(
                {
                    height: Number(height.toString())
                }
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryAllParams.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAllParamsResponse = QueryAllParamsResponse.fromJSON(
                    response
                )
                return queryAllParamsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     * Returns the network transaction codec upgrade height from amino to protobuf 
     * @param {nuber} height - Block height.
     * @param {nuber} timeout - (Optional) Request timeout value, default 60000.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
     public async getUpgrade(
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<QueryUpgradeResponse | RpcError> {
        try {

            const payload = "{}"

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryUpgrade.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryUpgradeResponse = QueryUpgradeResponse.fromJSON(
                    response
                )
                return queryUpgradeResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves a ChallengeResponse object.
     * @param {ChallengeRequest} request - The ChallengeRequest
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @memberof QueryNamespace
     */
    public async requestChallenge(
        request: ChallengeRequest,
        timeout: number = 60000, 
        rejectSelfSignedCertificates: boolean = true
    ): Promise<ChallengeResponse | RpcError> {
        try {
            const payload = JSON.stringify(request.toJSON())

            const response = await this.rpcProvider.send(
                V1RPCRoutes.ClientChallenge.toString(),
                payload,
                timeout, 
                rejectSelfSignedCertificates
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const challengeResponse = ChallengeResponse.fromJSON(
                    response
                )
                return challengeResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
}