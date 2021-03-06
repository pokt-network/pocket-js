import { TxLog } from "./tx-log"
import { typeGuard } from "../../../utils"

/**
 * Represents a /v1/rawtx RPC response
 */
export class RawTxResponse {
    /**
     * Construct this model from it's JSON representation
     * @param jsonStr {string}
     * @returns {RawTxResponse | Error}
     */
    public static fromJSON(jsonStr: string): RawTxResponse | Error {
        try {
            const rawTxResObj = JSON.parse(jsonStr)
            const logs: TxLog[] = []
            let height: BigInt
            let hash: string

            height = BigInt(rawTxResObj.height ?? 0)

            if (rawTxResObj.txhash && typeGuard(rawTxResObj.txhash, "string")) {
                hash = rawTxResObj.txhash as string
            } else {
                return new Error("Failed to parse RawTxRespone due to invalid tx hash: " + rawTxResObj.txhash)
            }
            // Parse the logs if they are available
            if (rawTxResObj.logs && typeGuard(rawTxResObj.logs, Array)) {
                const logObjs = rawTxResObj.logs as Array<{}>
                for (let i = 0; i < logObjs.length; i++) {
                    const txLogOrError = TxLog.fromJSONObj(logObjs[i])
                    if (typeGuard(txLogOrError, TxLog)) {
                        logs.push(txLogOrError as TxLog)
                    }
                }
            }

            let rawLog = rawTxResObj.raw_log ? rawTxResObj.raw_log : undefined
            if (rawLog !== undefined) {
                // Search for errors
                if (rawLog.includes("ERROR") || rawLog.include("error")) {
                    return new Error(rawLog)
                }
            }

            return new RawTxResponse(
                height, hash,
                rawTxResObj.code ? BigInt(rawTxResObj.code) : undefined,
                rawTxResObj.data ? rawTxResObj.data : undefined,
                rawLog,
                logs,
                rawTxResObj.info ? rawTxResObj.info : undefined,
                rawTxResObj.codespace ? rawTxResObj.codespace : undefined,
                rawTxResObj.tx ? rawTxResObj.tx : undefined,
                rawTxResObj.timestamp ? rawTxResObj.timestamp : undefined
            )
        } catch (err) {
            return err
        }
    }

    // Required fields
    public readonly height: BigInt
    public readonly hash: string
    // Optional fields
    public readonly code?: BigInt
    public readonly data?: string
    public readonly rawLog?: string
    public readonly logs?: TxLog[] 
    public readonly info?: string
    public readonly codeSpace?: string
    public readonly tx?: string
    public readonly timestamp?: string

    /**
     * Constructor for this class
     * @param {BigInt} height - The height for this Transaction
     * @param {string} hash - The transaction hash in hex format
     * @param {BigInt} code - The code for this tx
     * @param {string} data - Data hex for this tranaction
     * @param {string} rawLog - Dumped logs in string format
     * @param {TxLog[]} logs - Logs for this transaction
     * @param {string} info - Raw tx information.
     * @param {string} codeSpace - Code space string.
     * @param {string} tx - Transaction string.
     * @param {string} timestamp - Transaction timestamp.
     */
    public constructor(height: BigInt, hash: string, code?: BigInt, data?: string, rawLog?: string, logs?: TxLog[], info?: string, codeSpace?: string, tx?: string, timestamp?: string) {
        this.height = height
        this.hash = hash
        this.code = code
        this.data = data
        this.rawLog = rawLog
        this.logs = logs
        this.info = info
        this.codeSpace = codeSpace
        this.tx = tx
        this.timestamp = timestamp
    }
}