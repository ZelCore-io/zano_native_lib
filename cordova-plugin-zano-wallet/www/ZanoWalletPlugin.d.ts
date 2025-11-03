/**
 * Low-level Cordova plugin interface
 * Direct mapping to native methods via cordova.exec
 */
import type { ApiResponse, AddressInfo, AsyncJobResponse, app_connectivity_status, open_wallet_response, SimpleResult, WalletFilesResult, WalletInfo, WalletStatus, seed_phrase_info } from './entities';
/**
 * Low-level plugin methods - direct mapping to native code
 */
export declare const ZanoWalletPlugin: {
    init(address: string, workingDir: string, logLevel: number): Promise<string>;
    initWithIpPort(ip: string, port: string, workingDir: string, logLevel: number): Promise<string>;
    reset(): Promise<string>;
    setLogLevel(logLevel: number): Promise<string>;
    getVersion(): Promise<string>;
    getWalletFiles(): Promise<ApiResponse<WalletFilesResult>>;
    getExportPrivateInfo(targetDir: string): Promise<string>;
    deleteWallet(fileName: string): Promise<ApiResponse<SimpleResult>>;
    getAddressInfo(address: string): Promise<AddressInfo>;
    getWorkingDirectory(): Promise<string>;
    getDownloadsDirectory(): Promise<string>;
    getSeedPhraseInfo(seed: string, seedPassword: string): Promise<seed_phrase_info>;
    setAppConfig(confStr: string, encryptionKey: string): Promise<string>;
    getAppConfig(encryptionKey: string): Promise<string>;
    generateRandomKey(length: number): Promise<string>;
    getLogsBuffer(): Promise<string>;
    truncateLog(): Promise<string>;
    getConnectivityStatus(): Promise<app_connectivity_status>;
    open(path: string, password: string): Promise<ApiResponse<open_wallet_response>>;
    restore(seed: string, path: string, password: string, seedPassword: string): Promise<ApiResponse<open_wallet_response>>;
    generate(path: string, password: string): Promise<ApiResponse<open_wallet_response>>;
    getOpenedWallets(): Promise<ApiResponse<open_wallet_response[]>>;
    getWalletStatus(walletId: number): Promise<WalletStatus>;
    closeWallet(walletId: number): Promise<ApiResponse<SimpleResult>>;
    invoke(walletId: number, params: string | object): Promise<ApiResponse<any>>;
    asyncCall(methodName: string, walletId: number, params: string | object): Promise<AsyncJobResponse>;
    tryPullResult(jobId: number): Promise<ApiResponse<any> | null>;
    daemonCall(method: string, params: object): Promise<ApiResponse<any>>;
    isWalletExist(path: string): Promise<boolean>;
    getWalletInfo(walletId: number): Promise<WalletInfo>;
    resetWalletPassword(walletId: number, newPassword: string): Promise<string>;
    getCurrentTxFee(priority: number): Promise<number>;
};
export declare function pollAsyncResult(jobId: number, pollInterval?: number, maxWaitTime?: number): Promise<ApiResponse<any>>;
export declare function asyncCallAndWait(methodName: string, walletId: number, params: string | object): Promise<ApiResponse<any>>;
//# sourceMappingURL=ZanoWalletPlugin.d.ts.map