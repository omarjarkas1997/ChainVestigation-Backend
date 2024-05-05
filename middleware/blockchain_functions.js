const request = require('request');

// General function to perform RPC requests
function perform_rpc_request(method, params, callback) {
    const options = {
        url: `http://${process.env.BITCOIN_CORE_HOST}:${process.env.BITCOIN_CORE_PORT}`,
        method: 'POST',
        auth: {
            user: process.env.BITCOIN_CORE_USERNAME,
            pass: process.env.BITCOIN_CORE_PASSWORD
        },
        body: JSON.stringify({
            jsonrpc: "1.0",
            id: "curltext",
            method: method,
            params: params
        }),
        headers: {
            'Content-Type': 'text/plain;'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(`RPC Request Error for ${method}:`, error);
            callback(error, null);
        } else {
            console.log(`RPC Response for ${method}:`, body);
            try {
                const parsedBody = JSON.parse(body);
                callback(null, parsedBody.result);
            } catch (parseError) {
                console.error(`Error parsing JSON for ${method}:`, parseError);
                callback(parseError, null);
            }
        }
    });
}


// Specific function to get blockchain info
function getBlockchainInfo(callback) {
    perform_rpc_request("getblockchaininfo", [], callback);
}

// Specific function to get block count
function getBlockCount(callback) {
    perform_rpc_request("getblockcount", [], callback);
}

// Export the functions
function getBestBlockHash(callback) {
    perform_rpc_request("getbestblockhash", [], callback);
}

// Export the functions
function getdifficulty(callback) {
    perform_rpc_request("getdifficulty", [], callback);
}

// Export the functions
function getBlockHash(height, callback) {
    perform_rpc_request("getblockhash", [height], callback);
}

function getBlock(hash, callback) {
    perform_rpc_request("getblock", [hash], callback);
}

function getBlockByHeight(hash, callback) {
    perform_rpc_request("getblock", [hash], callback);
}

module.exports = {
    getBlockchainInfo,
    getBlockCount,
    getBestBlockHash,
    getdifficulty,
    getBlockHash,
    getBlock,
    getBlockByHeight
  };
