/**
 * ZanoWallet Cordova Plugin
 * JavaScript interface for Zano native wallet library
 */

var exec = require('cordova/exec');

var PLUGIN_NAME = 'ZanoWallet';

/**
 * Helper to promisify cordova exec calls
 */
function execPromise(action, args) {
    return new Promise(function(resolve, reject) {
        exec(
            function(result) {
                // Try to parse JSON response if it's a string
                if (typeof result === 'string') {
                    try {
                        result = JSON.parse(result);
                    } catch (e) {
                        // If not JSON, return as-is
                    }
                }
                resolve(result);
            },
            function(error) {
                reject(error);
            },
            PLUGIN_NAME,
            action,
            args || []
        );
    });
}

var ZanoWallet = {

    // ========== Initialization Functions ==========

    /**
     * Initialize the wallet library
     * @param {string} address - Server address (e.g., "http://127.0.0.1:2222")
     * @param {string} workingDir - Working directory path
     * @param {number} logLevel - Log level (0=default, -1=disabled)
     * @returns {Promise<string>} Initialization result
     */
    init: function(address, workingDir, logLevel) {
        return execPromise('init', [address, workingDir, logLevel]);
    },

    /**
     * Initialize with separate IP and port
     * @param {string} ip - Server IP address
     * @param {string} port - Server port
     * @param {string} workingDir - Working directory path
     * @param {number} logLevel - Log level
     * @returns {Promise<string>} Initialization result
     */
    initWithIpPort: function(ip, port, workingDir, logLevel) {
        return execPromise('initWithIpPort', [ip, port, workingDir, logLevel]);
    },

    // ========== Utility Functions ==========

    /**
     * Reset and close all opened wallets
     * @returns {Promise<string>} Reset result
     */
    reset: function() {
        return execPromise('reset', []);
    },

    /**
     * Set log level
     * @param {number} logLevel - Log level (0=default, -1=disabled)
     * @returns {Promise<string>} Result
     */
    setLogLevel: function(logLevel) {
        return execPromise('setLogLevel', [logLevel]);
    },

    /**
     * Get wallet library version
     * @returns {Promise<string>} Version string
     */
    getVersion: function() {
        return execPromise('getVersion', []);
    },

    /**
     * Get list of wallet files in working directory
     * @returns {Promise<Object>} Object with items array
     */
    getWalletFiles: function() {
        return execPromise('getWalletFiles', []);
    },

    /**
     * Export private information
     * @param {string} targetDir - Target directory path
     * @returns {Promise<string>} Result
     */
    getExportPrivateInfo: function(targetDir) {
        return execPromise('getExportPrivateInfo', [targetDir]);
    },

    /**
     * Delete a wallet file
     * @param {string} fileName - Wallet file name
     * @returns {Promise<Object>} Result with return_code
     */
    deleteWallet: function(fileName) {
        return execPromise('deleteWallet', [fileName]);
    },

    /**
     * Validate and get address information
     * @param {string} address - Zano address to validate
     * @returns {Promise<Object>} Address info (valid, auditable, payment_id, wrap)
     */
    getAddressInfo: function(address) {
        return execPromise('getAddressInfo', [address]);
    },

    // ========== Configuration Functions ==========

    /**
     * Set encrypted application configuration
     * @param {string} confStr - Configuration string (typically JSON)
     * @param {string} encryptionKey - Encryption key
     * @returns {Promise<string>} Result
     */
    setAppConfig: function(confStr, encryptionKey) {
        return execPromise('setAppConfig', [confStr, encryptionKey]);
    },

    /**
     * Get encrypted application configuration
     * @param {string} encryptionKey - Encryption key
     * @returns {Promise<string>} Configuration string
     */
    getAppConfig: function(encryptionKey) {
        return execPromise('getAppConfig', [encryptionKey]);
    },

    /**
     * Generate secure random key
     * @param {number} length - Length of random key
     * @returns {Promise<string>} Random key
     */
    generateRandomKey: function(length) {
        return execPromise('generateRandomKey', [length]);
    },

    /**
     * Get logs buffer
     * @returns {Promise<string>} Logs
     */
    getLogsBuffer: function() {
        return execPromise('getLogsBuffer', []);
    },

    /**
     * Truncate log file
     * @returns {Promise<string>} Result
     */
    truncateLog: function() {
        return execPromise('truncateLog', []);
    },

    /**
     * Get connectivity status
     * @returns {Promise<Object>} Status object
     */
    getConnectivityStatus: function() {
        return execPromise('getConnectivityStatus', []);
    },

    // ========== Wallet Management Functions ==========

    /**
     * Open an existing wallet
     * @param {string} path - Wallet file path (relative to working dir)
     * @param {string} password - Wallet password
     * @returns {Promise<Object>} Wallet info with wallet_id
     */
    open: function(path, password) {
        return execPromise('open', [path, password]);
    },

    /**
     * Restore wallet from seed phrase
     * @param {string} seed - Seed phrase
     * @param {string} path - Wallet file path
     * @param {string} password - New wallet password
     * @param {string} seedPassword - Seed password (empty if none)
     * @returns {Promise<Object>} Wallet info with wallet_id
     */
    restore: function(seed, path, password, seedPassword) {
        return execPromise('restore', [seed, path, password, seedPassword || '']);
    },

    /**
     * Generate a new wallet
     * @param {string} path - Wallet file path
     * @param {string} password - Wallet password
     * @returns {Promise<Object>} Wallet info with wallet_id and seed
     */
    generate: function(path, password) {
        return execPromise('generate', [path, password]);
    },

    /**
     * Get list of opened wallets
     * @returns {Promise<Array>} Array of opened wallet info
     */
    getOpenedWallets: function() {
        return execPromise('getOpenedWallets', []);
    },

    // ========== Wallet Operations ==========

    /**
     * Get wallet status
     * @param {number} walletId - Wallet handle/ID
     * @returns {Promise<Object>} Status object
     */
    getWalletStatus: function(walletId) {
        return execPromise('getWalletStatus', [walletId]);
    },

    /**
     * Close a wallet
     * @param {number} walletId - Wallet handle/ID
     * @returns {Promise<Object>} Result with return_code
     */
    closeWallet: function(walletId) {
        return execPromise('closeWallet', [walletId]);
    },

    /**
     * Invoke wallet RPC method
     * @param {number} walletId - Wallet handle/ID
     * @param {string|Object} params - RPC parameters (JSON string or object)
     * @returns {Promise<Object>} RPC result
     */
    invoke: function(walletId, params) {
        var paramsStr = typeof params === 'string' ? params : JSON.stringify(params);
        return execPromise('invoke', [walletId, paramsStr]);
    },

    // ========== Asynchronous API Functions ==========

    /**
     * Make asynchronous API call
     * @param {string} methodName - Method name (open, close, restore, invoke, etc.)
     * @param {number} walletId - Wallet ID
     * @param {string|Object} params - Parameters
     * @returns {Promise<Object>} Object with job_id
     */
    asyncCall: function(methodName, walletId, params) {
        var paramsStr = typeof params === 'string' ? params : JSON.stringify(params);
        return execPromise('asyncCall', [methodName, walletId, paramsStr]);
    },

    /**
     * Try to pull result of async call
     * @param {number} jobId - Job ID from asyncCall
     * @returns {Promise<Object>} Result if ready, null if still processing
     */
    tryPullResult: function(jobId) {
        return execPromise('tryPullResult', [jobId]);
    },

    /**
     * Helper: Poll for async result until complete
     * @param {number} jobId - Job ID
     * @param {number} pollInterval - Poll interval in ms (default 100)
     * @param {number} maxWaitTime - Max wait time in ms (default 60000)
     * @returns {Promise<Object>} Final result
     */
    pollAsyncResult: function(jobId, pollInterval, maxWaitTime) {
        pollInterval = pollInterval || 100;
        maxWaitTime = maxWaitTime || 60000;
        var startTime = Date.now();

        var poll = function() {
            return ZanoWallet.tryPullResult(jobId).then(function(result) {
                if (result && result.result) {
                    return result;
                }

                if (Date.now() - startTime > maxWaitTime) {
                    throw new Error('Async operation timeout');
                }

                return new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve(poll());
                    }, pollInterval);
                });
            });
        };

        return poll();
    },

    /**
     * Helper: Execute async operation and wait for result
     * @param {string} methodName - Method name
     * @param {number} walletId - Wallet ID
     * @param {string|Object} params - Parameters
     * @returns {Promise<Object>} Final result
     */
    asyncCallAndWait: function(methodName, walletId, params) {
        return ZanoWallet.asyncCall(methodName, walletId, params)
            .then(function(response) {
                return ZanoWallet.pollAsyncResult(response.job_id);
            });
    },

    // ========== Cake Wallet API Extensions ==========

    /**
     * Check if wallet exists
     * @param {string} path - Wallet file path
     * @returns {Promise<boolean>} True if exists
     */
    isWalletExist: function(path) {
        return execPromise('isWalletExist', [path]);
    },

    /**
     * Get extended wallet information (including secrets)
     * @param {number} walletId - Wallet handle/ID
     * @returns {Promise<Object>} Extended wallet info
     */
    getWalletInfo: function(walletId) {
        return execPromise('getWalletInfo', [walletId]);
    },

    /**
     * Reset wallet password
     * @param {number} walletId - Wallet handle/ID
     * @param {string} newPassword - New password
     * @returns {Promise<string>} Result
     */
    resetWalletPassword: function(walletId, newPassword) {
        return execPromise('resetWalletPassword', [walletId, newPassword]);
    },

    /**
     * Get current transaction fee
     * @param {number} priority - Transaction priority
     * @returns {Promise<number>} Fee amount
     */
    getCurrentTxFee: function(priority) {
        return execPromise('getCurrentTxFee', [priority]);
    }
};

module.exports = ZanoWallet;
