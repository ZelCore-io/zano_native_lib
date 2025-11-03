"use strict";
/**
 * Low-level Cordova plugin interface
 * Direct mapping to native methods via cordova.exec
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZanoWalletPlugin = void 0;
exports.pollAsyncResult = pollAsyncResult;
exports.asyncCallAndWait = asyncCallAndWait;
const PLUGIN_NAME = 'ZanoWallet';
/**
 * Helper to promisify cordova exec calls
 */
function execPromise(action, args = []) {
    return new Promise((resolve, reject) => {
        cordova.exec((result) => {
            // Try to parse JSON response if it's a string
            if (typeof result === 'string') {
                try {
                    result = JSON.parse(result);
                }
                catch (e) {
                    // If not JSON, return as-is
                }
            }
            resolve(result);
        }, (error) => {
            reject(error);
        }, PLUGIN_NAME, action, args);
    });
}
/**
 * Low-level plugin methods - direct mapping to native code
 */
exports.ZanoWalletPlugin = {
    // ========== Initialization Functions ==========
    init(address, workingDir, logLevel) {
        return execPromise('init', [address, workingDir, logLevel]);
    },
    initWithIpPort(ip, port, workingDir, logLevel) {
        return execPromise('initWithIpPort', [ip, port, workingDir, logLevel]);
    },
    reset() {
        return execPromise('reset', []);
    },
    // ========== Utility Functions ==========
    setLogLevel(logLevel) {
        return execPromise('setLogLevel', [logLevel]);
    },
    getVersion() {
        return execPromise('getVersion', []);
    },
    getWalletFiles() {
        return execPromise('getWalletFiles', []);
    },
    getExportPrivateInfo(targetDir) {
        return execPromise('getExportPrivateInfo', [targetDir]);
    },
    deleteWallet(fileName) {
        return execPromise('deleteWallet', [fileName]);
    },
    getAddressInfo(address) {
        return execPromise('getAddressInfo', [address]);
    },
    getWorkingDirectory() {
        return execPromise('getWorkingDirectory', []);
    },
    getDownloadsDirectory() {
        return execPromise('getDownloadsDirectory', []);
    },
    getSeedPhraseInfo(seed, seedPassword) {
        return execPromise('getSeedPhraseInfo', [seed, seedPassword]);
    },
    // ========== Configuration Functions ==========
    setAppConfig(confStr, encryptionKey) {
        return execPromise('setAppConfig', [confStr, encryptionKey]);
    },
    getAppConfig(encryptionKey) {
        return execPromise('getAppConfig', [encryptionKey]);
    },
    generateRandomKey(length) {
        return execPromise('generateRandomKey', [length]);
    },
    getLogsBuffer() {
        return execPromise('getLogsBuffer', []);
    },
    truncateLog() {
        return execPromise('truncateLog', []);
    },
    getConnectivityStatus() {
        return execPromise('getConnectivityStatus', []);
    },
    // ========== Wallet Management Functions ==========
    open(path, password) {
        return execPromise('open', [path, password]);
    },
    restore(seed, path, password, seedPassword) {
        return execPromise('restore', [seed, path, password, seedPassword || '']);
    },
    generate(path, password) {
        return execPromise('generate', [path, password]);
    },
    getOpenedWallets() {
        return execPromise('getOpenedWallets', []);
    },
    // ========== Wallet Operations ==========
    getWalletStatus(walletId) {
        return execPromise('getWalletStatus', [walletId]);
    },
    closeWallet(walletId) {
        return execPromise('closeWallet', [walletId]);
    },
    invoke(walletId, params) {
        const paramsStr = typeof params === 'string' ? params : JSON.stringify(params);
        return execPromise('invoke', [walletId, paramsStr]);
    },
    // ========== Asynchronous API Functions ==========
    asyncCall(methodName, walletId, params) {
        const paramsStr = typeof params === 'string' ? params : JSON.stringify(params);
        return execPromise('asyncCall', [methodName, walletId, paramsStr]);
    },
    tryPullResult(jobId) {
        return execPromise('tryPullResult', [jobId]);
    },
    // ========== Daemon RPC ==========
    daemonCall(method, params) {
        return execPromise('daemonCall', [method, JSON.stringify(params)]);
    },
    // ========== Cake Wallet API Extensions ==========
    isWalletExist(path) {
        return execPromise('isWalletExist', [path]);
    },
    getWalletInfo(walletId) {
        return execPromise('getWalletInfo', [walletId]);
    },
    resetWalletPassword(walletId, newPassword) {
        return execPromise('resetWalletPassword', [walletId, newPassword]);
    },
    getCurrentTxFee(priority) {
        return execPromise('getCurrentTxFee', [priority]);
    },
};
// Helper functions for async operations
async function pollAsyncResult(jobId, pollInterval = 100, maxWaitTime = 60000) {
    const startTime = Date.now();
    const poll = async () => {
        const result = await exports.ZanoWalletPlugin.tryPullResult(jobId);
        if (result && result.result) {
            return result;
        }
        if (Date.now() - startTime > maxWaitTime) {
            throw new Error('Async operation timeout');
        }
        return new Promise((resolve) => {
            setTimeout(() => resolve(poll()), pollInterval);
        });
    };
    return poll();
}
async function asyncCallAndWait(methodName, walletId, params) {
    const response = await exports.ZanoWalletPlugin.asyncCall(methodName, walletId, params);
    return pollAsyncResult(response.job_id);
}
//# sourceMappingURL=ZanoWalletPlugin.js.map