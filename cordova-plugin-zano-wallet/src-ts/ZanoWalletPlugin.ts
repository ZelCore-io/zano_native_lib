/**
 * Low-level Cordova plugin interface
 * Direct mapping to native methods via cordova.exec
 */

import type {
  ApiResponse,
  AddressInfo,
  AsyncJobResponse,
  app_connectivity_status,
  open_wallet_response,
  SimpleResult,
  WalletFilesResult,
  WalletInfo,
  WalletStatus,
  seed_phrase_info
} from './entities';

declare const cordova: any;

const PLUGIN_NAME = 'ZanoWallet';

/**
 * Helper to promisify cordova exec calls
 */
function execPromise<T>(action: string, args: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    cordova.exec(
      (result: any) => {
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
      (error: any) => {
        reject(error);
      },
      PLUGIN_NAME,
      action,
      args
    );
  });
}

/**
 * Low-level plugin methods - direct mapping to native code
 */
export const ZanoWalletPlugin = {
  // ========== Initialization Functions ==========

  init(address: string, workingDir: string, logLevel: number): Promise<string> {
    return execPromise<string>('init', [address, workingDir, logLevel]);
  },

  initWithIpPort(ip: string, port: string, workingDir: string, logLevel: number): Promise<string> {
    return execPromise<string>('initWithIpPort', [ip, port, workingDir, logLevel]);
  },

  reset(): Promise<string> {
    return execPromise<string>('reset', []);
  },

  // ========== Utility Functions ==========

  setLogLevel(logLevel: number): Promise<string> {
    return execPromise<string>('setLogLevel', [logLevel]);
  },

  getVersion(): Promise<string> {
    return execPromise<string>('getVersion', []);
  },

  getWalletFiles(): Promise<ApiResponse<WalletFilesResult>> {
    return execPromise<ApiResponse<WalletFilesResult>>('getWalletFiles', []);
  },

  getExportPrivateInfo(targetDir: string): Promise<string> {
    return execPromise<string>('getExportPrivateInfo', [targetDir]);
  },

  deleteWallet(fileName: string): Promise<ApiResponse<SimpleResult>> {
    return execPromise<ApiResponse<SimpleResult>>('deleteWallet', [fileName]);
  },

  getAddressInfo(address: string): Promise<AddressInfo> {
    return execPromise<AddressInfo>('getAddressInfo', [address]);
  },

  getWorkingDirectory(): Promise<string> {
    return execPromise<string>('getWorkingDirectory', []);
  },

  getDownloadsDirectory(): Promise<string> {
    return execPromise<string>('getDownloadsDirectory', []);
  },

  getSeedPhraseInfo(seed: string, seedPassword: string): Promise<seed_phrase_info> {
    return execPromise<seed_phrase_info>('getSeedPhraseInfo', [seed, seedPassword]);
  },

  // ========== Configuration Functions ==========

  setAppConfig(confStr: string, encryptionKey: string): Promise<string> {
    return execPromise<string>('setAppConfig', [confStr, encryptionKey]);
  },

  getAppConfig(encryptionKey: string): Promise<string> {
    return execPromise<string>('getAppConfig', [encryptionKey]);
  },

  generateRandomKey(length: number): Promise<string> {
    return execPromise<string>('generateRandomKey', [length]);
  },

  getLogsBuffer(): Promise<string> {
    return execPromise<string>('getLogsBuffer', []);
  },

  truncateLog(): Promise<string> {
    return execPromise<string>('truncateLog', []);
  },

  getConnectivityStatus(): Promise<app_connectivity_status> {
    return execPromise<app_connectivity_status>('getConnectivityStatus', []);
  },

  // ========== Wallet Management Functions ==========

  open(path: string, password: string): Promise<ApiResponse<open_wallet_response>> {
    return execPromise<ApiResponse<open_wallet_response>>('open', [path, password]);
  },

  restore(seed: string, path: string, password: string, seedPassword: string): Promise<ApiResponse<open_wallet_response>> {
    return execPromise<ApiResponse<open_wallet_response>>('restore', [seed, path, password, seedPassword || '']);
  },

  generate(path: string, password: string): Promise<ApiResponse<open_wallet_response>> {
    return execPromise<ApiResponse<open_wallet_response>>('generate', [path, password]);
  },

  getOpenedWallets(): Promise<ApiResponse<open_wallet_response[]>> {
    return execPromise<ApiResponse<open_wallet_response[]>>('getOpenedWallets', []);
  },

  // ========== Wallet Operations ==========

  getWalletStatus(walletId: number): Promise<WalletStatus> {
    return execPromise<WalletStatus>('getWalletStatus', [walletId]);
  },

  closeWallet(walletId: number): Promise<ApiResponse<SimpleResult>> {
    return execPromise<ApiResponse<SimpleResult>>('closeWallet', [walletId]);
  },

  invoke(walletId: number, params: string | object): Promise<ApiResponse<any>> {
    const paramsStr = typeof params === 'string' ? params : JSON.stringify(params);
    return execPromise<ApiResponse<any>>('invoke', [walletId, paramsStr]);
  },

  // ========== Asynchronous API Functions ==========

  asyncCall(methodName: string, walletId: number, params: string | object): Promise<AsyncJobResponse> {
    const paramsStr = typeof params === 'string' ? params : JSON.stringify(params);
    return execPromise<AsyncJobResponse>('asyncCall', [methodName, walletId, paramsStr]);
  },

  tryPullResult(jobId: number): Promise<ApiResponse<any> | null> {
    return execPromise<ApiResponse<any> | null>('tryPullResult', [jobId]);
  },

  // ========== Daemon RPC ==========

  daemonCall(method: string, params: object): Promise<ApiResponse<any>> {
    return execPromise<ApiResponse<any>>('daemonCall', [method, JSON.stringify(params)]);
  },

  // ========== Cake Wallet API Extensions ==========

  isWalletExist(path: string): Promise<boolean> {
    return execPromise<boolean>('isWalletExist', [path]);
  },

  getWalletInfo(walletId: number): Promise<WalletInfo> {
    return execPromise<WalletInfo>('getWalletInfo', [walletId]);
  },

  resetWalletPassword(walletId: number, newPassword: string): Promise<string> {
    return execPromise<string>('resetWalletPassword', [walletId, newPassword]);
  },

  getCurrentTxFee(priority: number): Promise<number> {
    return execPromise<number>('getCurrentTxFee', [priority]);
  },
};

// Helper functions for async operations
export async function pollAsyncResult(
  jobId: number,
  pollInterval: number = 100,
  maxWaitTime: number = 60000
): Promise<ApiResponse<any>> {
  const startTime = Date.now();

  const poll = async (): Promise<ApiResponse<any>> => {
    const result = await ZanoWalletPlugin.tryPullResult(jobId);

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

export async function asyncCallAndWait(
  methodName: string,
  walletId: number,
  params: string | object
): Promise<ApiResponse<any>> {
  const response = await ZanoWalletPlugin.asyncCall(methodName, walletId, params);
  return pollAsyncResult(response.job_id);
}
