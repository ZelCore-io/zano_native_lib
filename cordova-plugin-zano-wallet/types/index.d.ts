/**
 * TypeScript definitions for cordova-plugin-zano-wallet
 */

declare module 'cordova-plugin-zano-wallet' {
    export = ZanoWallet;
}

interface Window {
    ZanoWallet: typeof ZanoWallet;
}

interface AssetInfo {
    asset_id: string;
    current_supply: number;
    decimal_point: number;
    full_name: string;
    hidden_supply: boolean;
    meta_info: string;
    owner: string;
    ticker: string;
    total_max_supply: number;
}

interface Balance {
    asset_info: AssetInfo;
    awaiting_in: number;
    awaiting_out: number;
    total: number;
    unlocked: number;
}

interface WalletInfo {
    address: string;
    balances: Balance[];
    has_bare_unspent_outputs: boolean;
    is_auditable: boolean;
    is_watch_only: boolean;
    mined_total: number;
    path: string;
    view_sec_key: string;
}

interface RecentHistory {
    last_item_index: number;
    total_history_items: number;
}

interface OpenWalletResult {
    name: string;
    pass: string;
    recent_history: RecentHistory;
    recovered: boolean;
    seed: string;
    wallet_file_size: number;
    wallet_id: number;
    wallet_local_bc_size: number;
    wi: WalletInfo;
}

interface WalletStatus {
    current_daemon_height: number;
    current_wallet_height: number;
    is_daemon_connected: boolean;
    is_in_long_refresh: boolean;
    progress: number;
    wallet_state: number;
}

interface ConnectivityStatus {
    is_online: boolean;
    is_server_busy: boolean;
    last_daemon_is_disconnected: boolean;
    last_proxy_communicate_timestamp: number;
}

interface AddressInfo {
    valid: boolean;
    auditable: boolean;
    payment_id: boolean;
    wrap: boolean;
}

interface AsyncJobResponse {
    job_id: number;
}

interface ApiResponse<T = any> {
    id: number;
    jsonrpc: string;
    result: T;
}

interface SimpleResult {
    return_code: string;
}

interface WalletFilesResult {
    items: string[];
}

declare namespace ZanoWallet {
    // ========== Initialization Functions ==========

    /**
     * Initialize the wallet library
     * @param address - Server address (e.g., "http://127.0.0.1:2222")
     * @param workingDir - Working directory path
     * @param logLevel - Log level (0=default, -1=disabled)
     */
    function init(address: string, workingDir: string, logLevel: number): Promise<string>;

    /**
     * Initialize with separate IP and port
     * @param ip - Server IP address
     * @param port - Server port
     * @param workingDir - Working directory path
     * @param logLevel - Log level
     */
    function initWithIpPort(ip: string, port: string, workingDir: string, logLevel: number): Promise<string>;

    // ========== Utility Functions ==========

    /**
     * Reset and close all opened wallets
     */
    function reset(): Promise<string>;

    /**
     * Set log level
     * @param logLevel - Log level (0=default, -1=disabled)
     */
    function setLogLevel(logLevel: number): Promise<string>;

    /**
     * Get wallet library version
     */
    function getVersion(): Promise<string>;

    /**
     * Get list of wallet files in working directory
     */
    function getWalletFiles(): Promise<ApiResponse<WalletFilesResult>>;

    /**
     * Export private information
     * @param targetDir - Target directory path
     */
    function getExportPrivateInfo(targetDir: string): Promise<string>;

    /**
     * Delete a wallet file
     * @param fileName - Wallet file name
     */
    function deleteWallet(fileName: string): Promise<ApiResponse<SimpleResult>>;

    /**
     * Validate and get address information
     * @param address - Zano address to validate
     */
    function getAddressInfo(address: string): Promise<AddressInfo>;

    // ========== Configuration Functions ==========

    /**
     * Set encrypted application configuration
     * @param confStr - Configuration string (typically JSON)
     * @param encryptionKey - Encryption key
     */
    function setAppConfig(confStr: string, encryptionKey: string): Promise<string>;

    /**
     * Get encrypted application configuration
     * @param encryptionKey - Encryption key
     */
    function getAppConfig(encryptionKey: string): Promise<string>;

    /**
     * Generate secure random key
     * @param length - Length of random key
     */
    function generateRandomKey(length: number): Promise<string>;

    /**
     * Get logs buffer
     */
    function getLogsBuffer(): Promise<string>;

    /**
     * Truncate log file
     */
    function truncateLog(): Promise<string>;

    /**
     * Get connectivity status
     */
    function getConnectivityStatus(): Promise<ConnectivityStatus>;

    // ========== Wallet Management Functions ==========

    /**
     * Open an existing wallet
     * @param path - Wallet file path (relative to working dir)
     * @param password - Wallet password
     */
    function open(path: string, password: string): Promise<ApiResponse<OpenWalletResult>>;

    /**
     * Restore wallet from seed phrase
     * @param seed - Seed phrase
     * @param path - Wallet file path
     * @param password - New wallet password
     * @param seedPassword - Seed password (empty if none)
     */
    function restore(seed: string, path: string, password: string, seedPassword?: string): Promise<ApiResponse<OpenWalletResult>>;

    /**
     * Generate a new wallet
     * @param path - Wallet file path
     * @param password - Wallet password
     */
    function generate(path: string, password: string): Promise<ApiResponse<OpenWalletResult>>;

    /**
     * Get list of opened wallets
     */
    function getOpenedWallets(): Promise<ApiResponse<OpenWalletResult[]>>;

    // ========== Wallet Operations ==========

    /**
     * Get wallet status
     * @param walletId - Wallet handle/ID
     */
    function getWalletStatus(walletId: number): Promise<WalletStatus>;

    /**
     * Close a wallet
     * @param walletId - Wallet handle/ID
     */
    function closeWallet(walletId: number): Promise<ApiResponse<SimpleResult>>;

    /**
     * Invoke wallet RPC method
     * @param walletId - Wallet handle/ID
     * @param params - RPC parameters (JSON string or object)
     */
    function invoke(walletId: number, params: string | object): Promise<ApiResponse<any>>;

    // ========== Asynchronous API Functions ==========

    /**
     * Make asynchronous API call
     * @param methodName - Method name (open, close, restore, invoke, etc.)
     * @param walletId - Wallet ID
     * @param params - Parameters
     */
    function asyncCall(methodName: string, walletId: number, params: string | object): Promise<AsyncJobResponse>;

    /**
     * Try to pull result of async call
     * @param jobId - Job ID from asyncCall
     */
    function tryPullResult(jobId: number): Promise<ApiResponse<any> | null>;

    /**
     * Helper: Poll for async result until complete
     * @param jobId - Job ID
     * @param pollInterval - Poll interval in ms (default 100)
     * @param maxWaitTime - Max wait time in ms (default 60000)
     */
    function pollAsyncResult(jobId: number, pollInterval?: number, maxWaitTime?: number): Promise<ApiResponse<any>>;

    /**
     * Helper: Execute async operation and wait for result
     * @param methodName - Method name
     * @param walletId - Wallet ID
     * @param params - Parameters
     */
    function asyncCallAndWait(methodName: string, walletId: number, params: string | object): Promise<ApiResponse<any>>;

    // ========== Cake Wallet API Extensions ==========

    /**
     * Check if wallet exists
     * @param path - Wallet file path
     */
    function isWalletExist(path: string): Promise<boolean>;

    /**
     * Get extended wallet information (including secrets)
     * @param walletId - Wallet handle/ID
     */
    function getWalletInfo(walletId: number): Promise<WalletInfo>;

    /**
     * Reset wallet password
     * @param walletId - Wallet handle/ID
     * @param newPassword - New password
     */
    function resetWalletPassword(walletId: number, newPassword: string): Promise<string>;

    /**
     * Get current transaction fee
     * @param priority - Transaction priority
     */
    function getCurrentTxFee(priority: number): Promise<number>;
}
