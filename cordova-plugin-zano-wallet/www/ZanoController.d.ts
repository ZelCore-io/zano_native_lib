/**
 * ZanoController - High-level API controller
 * Main entry point for Zano wallet functionality
 */
import { ZanoWalletInstance } from './ZanoWalletInstance';
import type { AddressInfo, app_connectivity_status, seed_phrase_info, ZanoLogLevel, ZanoPriority } from './entities';
export declare class ZanoWalletFile {
    readonly controller: ZanoController;
    readonly name: string;
    private _wallet;
    constructor(controller: ZanoController, name: string, _wallet?: ZanoWalletInstance | null);
    get wallet(): ZanoWalletInstance | null;
    /**
     * Open wallet file
     */
    open(password: string): Promise<ZanoWalletInstance>;
    /**
     * Check if wallet is opened
     */
    isOpened(): boolean;
    /**
     * Internal method to set wallet instance
     */
    _setWallet(wallet: ZanoWalletInstance | null): void;
}
export declare class ZanoController {
    private _initialized;
    private _walletFiles;
    private _workingDirectory;
    private _downloadsDirectory;
    private _logLevel;
    private _remoteNode;
    constructor(remoteNode?: string, logLevel?: ZanoLogLevel);
    /**
     * Initialize wallet library
     */
    initialize(workingDir?: string): Promise<void>;
    /**
     * Dispose/reset wallet library
     */
    dispose(): Promise<void>;
    /**
     * Get library version
     */
    get_lib_version(): Promise<string>;
    /**
     * Get working directory
     */
    get working_directory(): string;
    /**
     * Get downloads directory
     */
    get downloads_directory(): string;
    /**
     * Get/Set log level
     */
    get log_level(): ZanoLogLevel;
    set_log_level(level: ZanoLogLevel): Promise<void>;
    /**
     * Get remote node
     */
    get remote_node(): string;
    /**
     * Get wallet files map
     */
    get wallet_files(): ReadonlyMap<string, ZanoWalletFile>;
    /**
     * Get address information
     */
    get_address_info(address: string): Promise<AddressInfo>;
    /**
     * Get seed phrase information
     */
    get_seed_phrase_info(seedPhrase: string, seedPassword?: string): Promise<seed_phrase_info>;
    /**
     * Get connectivity status
     */
    get_connectivity_status(): Promise<app_connectivity_status>;
    /**
     * Get current transaction fee
     */
    get_current_tx_fee(priority: ZanoPriority): Promise<number>;
    /**
     * Get logs buffer
     */
    get_logs_buffer(): Promise<string>;
    /**
     * Truncate log file
     */
    truncate_log(): Promise<void>;
    /**
     * Export private information
     */
    export_private_info(targetDir: string): Promise<void>;
    /**
     * Generate random key
     */
    generate_random_key(length?: number): Promise<string>;
    /**
     * Generate new wallet
     */
    generate_wallet(name: string, password: string): Promise<ZanoWalletInstance>;
    /**
     * Restore wallet from seed
     */
    restore_wallet(name: string, password: string, seed: string, seedPassword?: string): Promise<ZanoWalletInstance>;
    /**
     * Delete wallet file
     */
    delete_wallet_file(name: string): Promise<void>;
    /**
     * Check if wallet exists
     */
    is_wallet_exist(path: string): Promise<boolean>;
    /**
     * Daemon RPC proxy
     * All daemon methods are accessible through this property
     */
    readonly daemon: {
        /**
         * Call any daemon RPC method
         */
        call: (method: string, params?: any) => Promise<any>;
        getblockcount: () => Promise<{
            count: number;
            status: string;
        }>;
        on_getblockhash: (height: number) => Promise<string>;
        getlastblockheader: () => Promise<any>;
        getblockheaderbyhash: (hash: string) => Promise<any>;
        getblockheaderbyheight: (height: number) => Promise<any>;
        get_blocks_details: (height_start: number, count: number) => Promise<any>;
        get_tx_details: (tx_hash: string) => Promise<any>;
        search_by_id: (id: string) => Promise<any>;
        get_alias_details: (alias: string) => Promise<{
            alias: string;
            address: string;
            tracking_key: string;
            comment: string;
        }>;
        get_alias_by_address: (address: string) => Promise<{
            alias: string;
        }>;
        get_alias_reward: () => Promise<{
            reward: number;
        }>;
        get_asset_info: (asset_id: string) => Promise<any>;
        get_assets_list: (offset?: number, count?: number) => Promise<any>;
        marketplace_global_get_offers_ex: (filter: any) => Promise<any>;
        get_info: (flags?: number) => Promise<any>;
        get_current_core_tx_expiration_median: () => Promise<any>;
        get_pool_txs_details: () => Promise<any>;
        get_pool_txs_brief_details: () => Promise<any>;
        validate_signature: (params: {
            buff: string;
            signature: string;
            pkey: string;
        }) => Promise<{
            result: boolean;
        }>;
        decrypt_tx_details: (params: any) => Promise<any>;
    };
}
export declare class ZanoAppConfig<T = any> {
    private controller;
    private _data;
    private _encryptionKey;
    constructor(controller: ZanoController, initialData: T, encryptionKey?: string);
    /**
     * Initialize and load config
     */
    initialize(generateKeyIfMissing?: boolean): Promise<void>;
    /**
     * Get config data
     */
    get(): T;
    /**
     * Set config data
     */
    set(data: T): Promise<void>;
    /**
     * Get encryption key
     */
    get encryption_key(): string;
}
//# sourceMappingURL=ZanoController.d.ts.map