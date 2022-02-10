/**
 * Enum listing versions supported by this SDK
 */
enum Versions {
  V1 = '/v1',
}

/**
 * Enum indicating all the routes in the V1 RPC Interface
 */
export enum V1RpcRoutes {
  ClientChallenge = Versions.V1 + '/client/challenge',
  ClientDispatch = Versions.V1 + '/client/dispatch',
  ClientRawTx = Versions.V1 + '/client/rawtx',
  ClientRelay = Versions.V1 + '/client/relay',
  QueryAccount = Versions.V1 + '/query/account',
  QueryAccountTxs = Versions.V1 + '/query/accounttxs',
  QueryAllParams = Versions.V1 + '/query/allparams',
  QueryApp = Versions.V1 + '/query/app',
  QueryAppParams = Versions.V1 + '/query/appparams',
  QueryApps = Versions.V1 + '/query/apps',
  QueryBalance = Versions.V1 + '/query/balance',
  QueryBlock = Versions.V1 + '/query/block',
  QueryBlockTxs = Versions.V1 + '/query/blocktxs',
  QueryHeight = Versions.V1 + '/query/height',
  QueryNode = Versions.V1 + '/query/node',
  QueryNodeClaim = Versions.V1 + '/query/nodeclaim',
  QueryNodeClaims = Versions.V1 + '/query/nodeclaims',
  QueryNodeParams = Versions.V1 + '/query/nodeparams',
  QueryNodeReceipt = Versions.V1 + '/query/nodereceipt',
  QueryNodeReceipts = Versions.V1 + '/query/nodereceipts',
  QueryNodes = Versions.V1 + '/query/nodes',
  QueryPocketParams = Versions.V1 + '/query/pocketparams',
  QuerySupply = Versions.V1 + '/query/supply',
  QuerySupportedChains = Versions.V1 + '/query/supportedchains',
  QueryTX = Versions.V1 + '/query/tx',
  QueryUpgrade = Versions.V1 + '/query/upgrade',
}
