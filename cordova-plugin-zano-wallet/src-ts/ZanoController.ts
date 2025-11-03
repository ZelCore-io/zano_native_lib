/**
 * ZanoController - High-level API controller
 * Main entry point for Zano wallet functionality
 */

import { ZanoWalletPlugin } from './ZanoWalletPlugin';
import { ZanoWalletInstance } from './ZanoWalletInstance';
import type {
  AddressInfo,
  app_connectivity_status,
  seed_phrase_info,
  ZanoLogLevel,
  ZanoPriority,
} from './entities';

export class ZanoWalletFile {
  constructor(
    public readonly controller: ZanoController,
    public readonly name: string,
    private _wallet: ZanoWalletInstance | null = null
  ) {}

  get wallet(): ZanoWalletInstance | null {
    return this._wallet;
  }

  /**
   * Open wallet file
   */
  async open(password: string): Promise<ZanoWalletInstance> {
    if (this._wallet) {
      return this._wallet;
    }

    const response = await ZanoWalletPlugin.open(this.name, password);

    if (response.error || !response.result) {
      throw new Error(`Failed to open wallet: ${response.error?.message || 'Unknown error'}`);
    }

    const wallet = new ZanoWalletInstance({
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
  isOpened(): boolean {
    return this._wallet !== null;
  }

  /**
   * Internal method to set wallet instance
   */
  _setWallet(wallet: ZanoWalletInstance | null): void {
    this._wallet = wallet;
  }
}

export class ZanoController {
  private _initialized: boolean = false;
  private _walletFiles: Map<string, ZanoWalletFile> = new Map();
  private _workingDirectory: string = '';
  private _downloadsDirectory: string = '';
  private _logLevel: ZanoLogLevel = -1; // DISABLED
  private _remoteNode: string;

  constructor(remoteNode: string = 'https://node.zano.org:443', logLevel: ZanoLogLevel = -1) {
    this._remoteNode = remoteNode;
    this._logLevel = logLevel;
  }

  // ========== Initialization ==========

  /**
   * Initialize wallet library
   */
  async initialize(workingDir?: string): Promise<void> {
    if (this._initialized) {
      throw new Error('Already initialized');
    }

    // Get platform directories if not provided
    if (!workingDir) {
      this._workingDirectory = await ZanoWalletPlugin.getWorkingDirectory();
      this._downloadsDirectory = await ZanoWalletPlugin.getDownloadsDirectory();
    } else {
      this._workingDirectory = workingDir;
      this._downloadsDirectory = workingDir;
    }

    // Initialize library
    const response = await ZanoWalletPlugin.init(
      this._remoteNode,
      this._workingDirectory,
      this._logLevel
    );

    if (typeof response === 'string' && response.includes('error')) {
      throw new Error(`Initialization failed: ${response}`);
    }

    // Load existing wallet files
    const filesResponse = await ZanoWalletPlugin.getWalletFiles();
    const items = filesResponse.result?.items || [];

    for (const name of items) {
      this._walletFiles.set(name, new ZanoWalletFile(this, name));
    }

    // Load opened wallets
    const openedResponse = await ZanoWalletPlugin.getOpenedWallets();
    if (openedResponse.result) {
      for (const walletData of openedResponse.result) {
        const file = this._walletFiles.get(walletData.name);
        if (file) {
          const wallet = new ZanoWalletInstance(walletData);
          file._setWallet(wallet);
        }
      }
    }

    this._initialized = true;
  }

  /**
   * Dispose/reset wallet library
   */
  async dispose(): Promise<void> {
    if (!this._initialized) {
      throw new Error('Not initialized');
    }

    await ZanoWalletPlugin.reset();
    this._walletFiles.clear();
    this._initialized = false;
  }

  // ========== Properties ==========

  /**
   * Get library version
   */
  async get_lib_version(): Promise<string> {
    return ZanoWalletPlugin.getVersion();
  }

  /**
   * Get working directory
   */
  get working_directory(): string {
    return this._workingDirectory;
  }

  /**
   * Get downloads directory
   */
  get downloads_directory(): string {
    return this._downloadsDirectory;
  }

  /**
   * Get/Set log level
   */
  get log_level(): ZanoLogLevel {
    return this._logLevel;
  }

  async set_log_level(level: ZanoLogLevel): Promise<void> {
    await ZanoWalletPlugin.setLogLevel(level);
    this._logLevel = level;
  }

  /**
   * Get remote node
   */
  get remote_node(): string {
    return this._remoteNode;
  }

  /**
   * Get wallet files map
   */
  get wallet_files(): ReadonlyMap<string, ZanoWalletFile> {
    return this._walletFiles;
  }

  // ========== Utility Methods ==========

  /**
   * Get address information
   */
  get_address_info(address: string): Promise<AddressInfo> {
    return ZanoWalletPlugin.getAddressInfo(address);
  }

  /**
   * Get seed phrase information
   */
  get_seed_phrase_info(seedPhrase: string, seedPassword: string = ''): Promise<seed_phrase_info> {
    return ZanoWalletPlugin.getSeedPhraseInfo(seedPhrase, seedPassword);
  }

  /**
   * Get connectivity status
   */
  get_connectivity_status(): Promise<app_connectivity_status> {
    return ZanoWalletPlugin.getConnectivityStatus();
  }

  /**
   * Get current transaction fee
   */
  get_current_tx_fee(priority: ZanoPriority): Promise<number> {
    return ZanoWalletPlugin.getCurrentTxFee(priority);
  }

  /**
   * Get logs buffer
   */
  get_logs_buffer(): Promise<string> {
    return ZanoWalletPlugin.getLogsBuffer();
  }

  /**
   * Truncate log file
   */
  async truncate_log(): Promise<void> {
    await ZanoWalletPlugin.truncateLog();
  }

  /**
   * Export private information
   */
  async export_private_info(targetDir: string): Promise<void> {
    await ZanoWalletPlugin.getExportPrivateInfo(targetDir);
  }

  /**
   * Generate random key
   */
  generate_random_key(length: number = 20): Promise<string> {
    return ZanoWalletPlugin.generateRandomKey(length);
  }

  // ========== Wallet Management ==========

  /**
   * Generate new wallet
   */
  async generate_wallet(name: string, password: string): Promise<ZanoWalletInstance> {
    if (this._walletFiles.has(name)) {
      throw new Error(`Wallet "${name}" already exists`);
    }

    const response = await ZanoWalletPlugin.generate(name, password);

    if (response.error || !response.result) {
      throw new Error(`Failed to generate wallet: ${response.error?.message || 'Unknown error'}`);
    }

    const wallet = new ZanoWalletInstance({
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
  async restore_wallet(
    name: string,
    password: string,
    seed: string,
    seedPassword: string = ''
  ): Promise<ZanoWalletInstance> {
    if (this._walletFiles.has(name)) {
      throw new Error(`Wallet "${name}" already exists`);
    }

    const response = await ZanoWalletPlugin.restore(seed, name, password, seedPassword);

    if (response.error || !response.result) {
      throw new Error(`Failed to restore wallet: ${response.error?.message || 'Unknown error'}`);
    }

    const wallet = new ZanoWalletInstance({
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
  async delete_wallet_file(name: string): Promise<void> {
    const file = this._walletFiles.get(name);
    if (!file) {
      return;
    }

    // Close wallet if opened
    if (file.wallet) {
      await file.wallet.close();
    }

    await ZanoWalletPlugin.deleteWallet(name);
    this._walletFiles.delete(name);
  }

  /**
   * Check if wallet exists
   */
  async is_wallet_exist(path: string): Promise<boolean> {
    return ZanoWalletPlugin.isWalletExist(path);
  }

  // ========== Daemon RPC Methods ==========

  /**
   * Daemon RPC proxy
   * All daemon methods are accessible through this property
   */
  readonly daemon = {
    /**
     * Call any daemon RPC method
     */
    call: async (method: string, params: any = {}): Promise<any> => {
      const response = await ZanoWalletPlugin.daemonCall(method, params);

      if (response.error) {
        throw new Error(`Daemon RPC Error: ${response.error.message}`);
      }

      return response.result;
    },

    // Block methods
    getblockcount: async (): Promise<{ count: number; status: string }> => {
      return this.daemon.call('getblockcount', {});
    },

    on_getblockhash: async (height: number): Promise<string> => {
      return this.daemon.call('on_getblockhash', [height]);
    },

    getlastblockheader: async (): Promise<any> => {
      return this.daemon.call('getlastblockheader', {});
    },

    getblockheaderbyhash: async (hash: string): Promise<any> => {
      return this.daemon.call('getblockheaderbyhash', { hash });
    },

    getblockheaderbyheight: async (height: number): Promise<any> => {
      return this.daemon.call('getblockheaderbyheight', { height });
    },

    get_blocks_details: async (height_start: number, count: number): Promise<any> => {
      return this.daemon.call('get_blocks_details', { height_start, count });
    },

    get_tx_details: async (tx_hash: string): Promise<any> => {
      return this.daemon.call('get_tx_details', { tx_hash });
    },

    search_by_id: async (id: string): Promise<any> => {
      return this.daemon.call('search_by_id', { id });
    },

    // Alias methods
    get_alias_details: async (alias: string): Promise<{
      alias: string;
      address: string;
      tracking_key: string;
      comment: string;
    }> => {
      return this.daemon.call('get_alias_details', { alias });
    },

    get_alias_by_address: async (address: string): Promise<{ alias: string }> => {
      return this.daemon.call('get_alias_by_address', { address });
    },

    get_alias_reward: async (): Promise<{ reward: number }> => {
      return this.daemon.call('get_alias_reward', {});
    },

    // Asset methods
    get_asset_info: async (asset_id: string): Promise<any> => {
      return this.daemon.call('get_asset_info', { asset_id });
    },

    get_assets_list: async (offset?: number, count?: number): Promise<any> => {
      return this.daemon.call('get_assets_list', { offset, count });
    },

    // Marketplace methods
    marketplace_global_get_offers_ex: async (filter: any): Promise<any> => {
      return this.daemon.call('marketplace_global_get_offers_ex', filter);
    },

    // Network methods
    get_info: async (flags?: number): Promise<any> => {
      return this.daemon.call('get_info', { flags });
    },

    get_current_core_tx_expiration_median: async (): Promise<any> => {
      return this.daemon.call('get_current_core_tx_expiration_median', {});
    },

    // Pool methods
    get_pool_txs_details: async (): Promise<any> => {
      return this.daemon.call('get_pool_txs_details', {});
    },

    get_pool_txs_brief_details: async (): Promise<any> => {
      return this.daemon.call('get_pool_txs_brief_details', {});
    },

    // Other methods
    validate_signature: async (params: {
      buff: string;
      signature: string;
      pkey: string;
    }): Promise<{ result: boolean }> => {
      return this.daemon.call('validate_signature', params);
    },

    decrypt_tx_details: async (params: any): Promise<any> => {
      return this.daemon.call('decrypt_tx_details', params);
    },
  };
}

// ========== App Config Helper ==========

export class ZanoAppConfig<T = any> {
  private _data: T;
  private _encryptionKey: string;

  constructor(
    private controller: ZanoController,
    initialData: T,
    encryptionKey?: string
  ) {
    this._data = initialData;
    this._encryptionKey = encryptionKey || '';
  }

  /**
   * Initialize and load config
   */
  async initialize(generateKeyIfMissing: boolean = true): Promise<void> {
    if (!this._encryptionKey && generateKeyIfMissing) {
      this._encryptionKey = await this.controller.generate_random_key(20);
    }

    try {
      const configStr = await ZanoWalletPlugin.getAppConfig(this._encryptionKey);
      if (configStr && configStr !== '{}') {
        this._data = JSON.parse(configStr);
      }
    } catch (e) {
      // Config doesn't exist yet, use initial data
    }
  }

  /**
   * Get config data
   */
  get(): T {
    return this._data;
  }

  /**
   * Set config data
   */
  async set(data: T): Promise<void> {
    await ZanoWalletPlugin.setAppConfig(JSON.stringify(data), this._encryptionKey);
    this._data = data;
  }

  /**
   * Get encryption key
   */
  get encryption_key(): string {
    return this._encryptionKey;
  }
}
