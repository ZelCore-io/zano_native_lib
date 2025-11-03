"use strict";
/**
 * ZanoController - High-level API controller
 * Main entry point for Zano wallet functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZanoAppConfig = exports.ZanoController = exports.ZanoWalletFile = void 0;
const ZanoWalletPlugin_1 = require("./ZanoWalletPlugin");
const ZanoWalletInstance_1 = require("./ZanoWalletInstance");
class ZanoWalletFile {
    constructor(controller, name, _wallet = null) {
        this.controller = controller;
        this.name = name;
        this._wallet = _wallet;
    }
    get wallet() {
        return this._wallet;
    }
    /**
     * Open wallet file
     */
    async open(password) {
        var _a;
        if (this._wallet) {
            return this._wallet;
        }
        const response = await ZanoWalletPlugin_1.ZanoWalletPlugin.open(this.name, password);
        if (response.error || !response.result) {
            throw new Error(`Failed to open wallet: ${((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'}`);
        }
        const wallet = new ZanoWalletInstance_1.ZanoWalletInstance({
            wallet_id: response.result.wallet_id,
            name: this.name,
            pass: password,
            wi: response.result.wi,
            recent_history: response.result.recent_history,
            seed: response.result.seed,
            recovered: response.result.recovered,
            wallet_local_bc_size: response.result.wallet_local_bc_size,
            wallet_file_size: response.result.wallet_file_size,
        });
        this._wallet = wallet;
        return wallet;
    }
    /**
     * Check if wallet is opened
     */
    isOpened() {
        return this._wallet !== null;
    }
    /**
     * Internal method to set wallet instance
     */
    _setWallet(wallet) {
        this._wallet = wallet;
    }
}
exports.ZanoWalletFile = ZanoWalletFile;
class ZanoController {
    constructor(remoteNode = 'https://node.zano.org:443', logLevel = -1) {
        this._initialized = false;
        this._walletFiles = new Map();
        this._workingDirectory = '';
        this._downloadsDirectory = '';
        this._logLevel = -1; // DISABLED
        // ========== Daemon RPC Methods ==========
        /**
         * Daemon RPC proxy
         * All daemon methods are accessible through this property
         */
        this.daemon = {
            /**
             * Call any daemon RPC method
             */
            call: async (method, params = {}) => {
                const response = await ZanoWalletPlugin_1.ZanoWalletPlugin.daemonCall(method, params);
                if (response.error) {
                    throw new Error(`Daemon RPC Error: ${response.error.message}`);
                }
                return response.result;
            },
            // Block methods
            getblockcount: async () => {
                return this.daemon.call('getblockcount', {});
            },
            on_getblockhash: async (height) => {
                return this.daemon.call('on_getblockhash', [height]);
            },
            getlastblockheader: async () => {
                return this.daemon.call('getlastblockheader', {});
            },
            getblockheaderbyhash: async (hash) => {
                return this.daemon.call('getblockheaderbyhash', { hash });
            },
            getblockheaderbyheight: async (height) => {
                return this.daemon.call('getblockheaderbyheight', { height });
            },
            get_blocks_details: async (height_start, count) => {
                return this.daemon.call('get_blocks_details', { height_start, count });
            },
            get_tx_details: async (tx_hash) => {
                return this.daemon.call('get_tx_details', { tx_hash });
            },
            search_by_id: async (id) => {
                return this.daemon.call('search_by_id', { id });
            },
            // Alias methods
            get_alias_details: async (alias) => {
                return this.daemon.call('get_alias_details', { alias });
            },
            get_alias_by_address: async (address) => {
                return this.daemon.call('get_alias_by_address', { address });
            },
            get_alias_reward: async () => {
                return this.daemon.call('get_alias_reward', {});
            },
            // Asset methods
            get_asset_info: async (asset_id) => {
                return this.daemon.call('get_asset_info', { asset_id });
            },
            get_assets_list: async (offset, count) => {
                return this.daemon.call('get_assets_list', { offset, count });
            },
            // Marketplace methods
            marketplace_global_get_offers_ex: async (filter) => {
                return this.daemon.call('marketplace_global_get_offers_ex', filter);
            },
            // Network methods
            get_info: async (flags) => {
                return this.daemon.call('get_info', { flags });
            },
            get_current_core_tx_expiration_median: async () => {
                return this.daemon.call('get_current_core_tx_expiration_median', {});
            },
            // Pool methods
            get_pool_txs_details: async () => {
                return this.daemon.call('get_pool_txs_details', {});
            },
            get_pool_txs_brief_details: async () => {
                return this.daemon.call('get_pool_txs_brief_details', {});
            },
            // Other methods
            validate_signature: async (params) => {
                return this.daemon.call('validate_signature', params);
            },
            decrypt_tx_details: async (params) => {
                return this.daemon.call('decrypt_tx_details', params);
            },
        };
        this._remoteNode = remoteNode;
        this._logLevel = logLevel;
    }
    // ========== Initialization ==========
    /**
     * Initialize wallet library
     */
    async initialize(workingDir) {
        var _a;
        if (this._initialized) {
            throw new Error('Already initialized');
        }
        // Get platform directories if not provided
        if (!workingDir) {
            this._workingDirectory = await ZanoWalletPlugin_1.ZanoWalletPlugin.getWorkingDirectory();
            this._downloadsDirectory = await ZanoWalletPlugin_1.ZanoWalletPlugin.getDownloadsDirectory();
        }
        else {
            this._workingDirectory = workingDir;
            this._downloadsDirectory = workingDir;
        }
        // Initialize library
        const response = await ZanoWalletPlugin_1.ZanoWalletPlugin.init(this._remoteNode, this._workingDirectory, this._logLevel);
        if (typeof response === 'string' && response.includes('error')) {
            throw new Error(`Initialization failed: ${response}`);
        }
        // Load existing wallet files
        const filesResponse = await ZanoWalletPlugin_1.ZanoWalletPlugin.getWalletFiles();
        const items = ((_a = filesResponse.result) === null || _a === void 0 ? void 0 : _a.items) || [];
        for (const name of items) {
            this._walletFiles.set(name, new ZanoWalletFile(this, name));
        }
        // Load opened wallets
        const openedResponse = await ZanoWalletPlugin_1.ZanoWalletPlugin.getOpenedWallets();
        if (openedResponse.result) {
            for (const walletData of openedResponse.result) {
                const file = this._walletFiles.get(walletData.name);
                if (file) {
                    const wallet = new ZanoWalletInstance_1.ZanoWalletInstance(walletData);
                    file._setWallet(wallet);
                }
            }
        }
        this._initialized = true;
    }
    /**
     * Dispose/reset wallet library
     */
    async dispose() {
        if (!this._initialized) {
            throw new Error('Not initialized');
        }
        await ZanoWalletPlugin_1.ZanoWalletPlugin.reset();
        this._walletFiles.clear();
        this._initialized = false;
    }
    // ========== Properties ==========
    /**
     * Get library version
     */
    async get_lib_version() {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.getVersion();
    }
    /**
     * Get working directory
     */
    get working_directory() {
        return this._workingDirectory;
    }
    /**
     * Get downloads directory
     */
    get downloads_directory() {
        return this._downloadsDirectory;
    }
    /**
     * Get/Set log level
     */
    get log_level() {
        return this._logLevel;
    }
    async set_log_level(level) {
        await ZanoWalletPlugin_1.ZanoWalletPlugin.setLogLevel(level);
        this._logLevel = level;
    }
    /**
     * Get remote node
     */
    get remote_node() {
        return this._remoteNode;
    }
    /**
     * Get wallet files map
     */
    get wallet_files() {
        return this._walletFiles;
    }
    // ========== Utility Methods ==========
    /**
     * Get address information
     */
    get_address_info(address) {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.getAddressInfo(address);
    }
    /**
     * Get seed phrase information
     */
    get_seed_phrase_info(seedPhrase, seedPassword = '') {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.getSeedPhraseInfo(seedPhrase, seedPassword);
    }
    /**
     * Get connectivity status
     */
    get_connectivity_status() {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.getConnectivityStatus();
    }
    /**
     * Get current transaction fee
     */
    get_current_tx_fee(priority) {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.getCurrentTxFee(priority);
    }
    /**
     * Get logs buffer
     */
    get_logs_buffer() {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.getLogsBuffer();
    }
    /**
     * Truncate log file
     */
    async truncate_log() {
        await ZanoWalletPlugin_1.ZanoWalletPlugin.truncateLog();
    }
    /**
     * Export private information
     */
    async export_private_info(targetDir) {
        await ZanoWalletPlugin_1.ZanoWalletPlugin.getExportPrivateInfo(targetDir);
    }
    /**
     * Generate random key
     */
    generate_random_key(length = 20) {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.generateRandomKey(length);
    }
    // ========== Wallet Management ==========
    /**
     * Generate new wallet
     */
    async generate_wallet(name, password) {
        var _a;
        if (this._walletFiles.has(name)) {
            throw new Error(`Wallet "${name}" already exists`);
        }
        const response = await ZanoWalletPlugin_1.ZanoWalletPlugin.generate(name, password);
        if (response.error || !response.result) {
            throw new Error(`Failed to generate wallet: ${((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'}`);
        }
        const wallet = new ZanoWalletInstance_1.ZanoWalletInstance({
            wallet_id: response.result.wallet_id,
            name,
            pass: password,
            wi: response.result.wi,
            recent_history: response.result.recent_history,
            seed: response.result.seed,
            recovered: response.result.recovered,
            wallet_local_bc_size: response.result.wallet_local_bc_size,
            wallet_file_size: response.result.wallet_file_size,
        });
        const file = new ZanoWalletFile(this, name, wallet);
        this._walletFiles.set(name, file);
        return wallet;
    }
    /**
     * Restore wallet from seed
     */
    async restore_wallet(name, password, seed, seedPassword = '') {
        var _a;
        if (this._walletFiles.has(name)) {
            throw new Error(`Wallet "${name}" already exists`);
        }
        const response = await ZanoWalletPlugin_1.ZanoWalletPlugin.restore(seed, name, password, seedPassword);
        if (response.error || !response.result) {
            throw new Error(`Failed to restore wallet: ${((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'}`);
        }
        const wallet = new ZanoWalletInstance_1.ZanoWalletInstance({
            wallet_id: response.result.wallet_id,
            name,
            pass: password,
            wi: response.result.wi,
            recent_history: response.result.recent_history,
            seed: response.result.seed,
            recovered: response.result.recovered,
            wallet_local_bc_size: response.result.wallet_local_bc_size,
            wallet_file_size: response.result.wallet_file_size,
        });
        const file = new ZanoWalletFile(this, name, wallet);
        this._walletFiles.set(name, file);
        return wallet;
    }
    /**
     * Delete wallet file
     */
    async delete_wallet_file(name) {
        const file = this._walletFiles.get(name);
        if (!file) {
            return;
        }
        // Close wallet if opened
        if (file.wallet) {
            await file.wallet.close();
        }
        await ZanoWalletPlugin_1.ZanoWalletPlugin.deleteWallet(name);
        this._walletFiles.delete(name);
    }
    /**
     * Check if wallet exists
     */
    async is_wallet_exist(path) {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.isWalletExist(path);
    }
}
exports.ZanoController = ZanoController;
// ========== App Config Helper ==========
class ZanoAppConfig {
    constructor(controller, initialData, encryptionKey) {
        this.controller = controller;
        this._data = initialData;
        this._encryptionKey = encryptionKey || '';
    }
    /**
     * Initialize and load config
     */
    async initialize(generateKeyIfMissing = true) {
        if (!this._encryptionKey && generateKeyIfMissing) {
            this._encryptionKey = await this.controller.generate_random_key(20);
        }
        try {
            const configStr = await ZanoWalletPlugin_1.ZanoWalletPlugin.getAppConfig(this._encryptionKey);
            if (configStr && configStr !== '{}') {
                this._data = JSON.parse(configStr);
            }
        }
        catch (e) {
            // Config doesn't exist yet, use initial data
        }
    }
    /**
     * Get config data
     */
    get() {
        return this._data;
    }
    /**
     * Set config data
     */
    async set(data) {
        await ZanoWalletPlugin_1.ZanoWalletPlugin.setAppConfig(JSON.stringify(data), this._encryptionKey);
        this._data = data;
    }
    /**
     * Get encryption key
     */
    get encryption_key() {
        return this._encryptionKey;
    }
}
exports.ZanoAppConfig = ZanoAppConfig;
//# sourceMappingURL=ZanoController.js.map