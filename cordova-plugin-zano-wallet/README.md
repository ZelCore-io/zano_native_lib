# cordova-plugin-zano-wallet

Cordova plugin for integrating Zano cryptocurrency wallet functionality into hybrid mobile applications on Android and iOS.

## Features

- **TypeScript-First Design** - Full TypeScript support with 100+ typed methods
- **High-Level API** - Object-oriented wallet management similar to React Native
- **Daemon RPC Access** - 30+ daemon methods for blockchain queries
- **Full Wallet Operations** - Balance, transfers, assets, marketplace, ionic swaps
- **Platform Utilities** - Directory access, seed validation, configuration storage
- **Asynchronous Support** - Promise-based async operations with job polling
- **Cross-Platform** - Android & iOS with native JNI/Objective-C++ bridges

## Installation

### Prerequisites

**Android:**
- Android SDK with NDK r21 or later
- Cordova Android platform 9.0.0 or later
- CMake 3.10.2 or later

**iOS:**
- Xcode 12.0 or later
- Cordova iOS platform 6.0.0 or later
- iOS deployment target 12.0 or later

### Install from npm

```bash
cordova plugin add cordova-plugin-zano-wallet
```

The plugin will automatically download pre-built native libraries (~250MB) from GitHub releases during installation.

### Install from local repository

If you have the zano_native_lib repository cloned locally:

```bash
cordova plugin add /path/to/zano_native_lib/cordova-plugin-zano-wallet
```

This will use the pre-built libraries from `_install_android/` and `_install_ios/` directories (no download needed).

## Quick Start

### TypeScript (Recommended)

```typescript
import { ZanoController } from 'cordova-plugin-zano-wallet';

// Create controller instance
const zano = new ZanoController('https://node.zano.org:443');

// Initialize (auto-detects platform directories)
await zano.initialize();

console.log(`Library version: ${await zano.get_lib_version()}`);
console.log(`Working directory: ${zano.working_directory}`);

// Generate a new wallet
const wallet = await zano.generate_wallet('MyWallet', 'password123');

// Get balance
const balance = await wallet.getbalance();
console.log(`Balance: ${balance.balance}`);

// Get wallet info
const info = await wallet.get_wallet_info();
console.log(`Address: ${info.wi.address}`);
console.log(`Balances:`, info.wi.balances);

// Send transaction
const tx = await wallet.transfer({
  destinations: [{
    address: 'ZxABC...',
    amount: 1000000000000
  }],
  fee: 10000000000,
  mixin: 10
});
console.log(`Transaction sent: ${tx.tx_hash}`);

// Use daemon API
const blockCount = await zano.daemon.getblockcount();
console.log(`Block count: ${blockCount.count}`);

const aliasInfo = await zano.daemon.get_alias_details({ alias: 'dev' });
console.log(`Alias address: ${aliasInfo.address}`);

// Close wallet
await wallet.close();
await zano.dispose();
```

### JavaScript (Classic API)

```javascript
// Low-level API still available for backward compatibility
const workingDir = cordova.file.dataDirectory;
ZanoWallet.init('http://127.0.0.1:2222', workingDir, 0)
  .then(result => console.log('Initialized:', result))
  .catch(error => console.error('Init failed:', error));

// Generate wallet
ZanoWallet.generate('my_wallet', 'password123')
  .then(result => {
    console.log('Wallet created!');
    console.log('Address:', result.result.wi.address);
    console.log('Seed:', result.result.seed);
  });
```

## API Overview

### ZanoController (Main Entry Point)

The main controller for managing wallets and accessing daemon RPC.

#### Initialization

```typescript
const zano = new ZanoController(remoteNode: string, logLevel?: ZanoLogLevel);

// Initialize with auto-detected directories
await zano.initialize();

// Or specify custom working directory
await zano.initialize('/custom/path');
```

#### Properties

- `working_directory` - Platform-specific app data directory
- `downloads_directory` - Platform-specific downloads directory
- `log_level` - Current logging level
- `remote_node` - Daemon node URL
- `daemon` - Daemon RPC API object

#### Wallet Management

```typescript
// Generate new wallet
const wallet = await zano.generate_wallet(name: string, password: string);

// Restore from seed
const wallet = await zano.restore_wallet(
  seed: string,
  name: string,
  password: string,
  seedPassword?: string
);

// Open existing wallet
const walletFile = zano.wallet_files.find(w => w.name === 'MyWallet');
const wallet = await walletFile.open(password);

// Close wallet
await wallet.close();

// Delete wallet file
await zano.delete_wallet_file('MyWallet');
```

#### Utilities

```typescript
// Validate seed phrase
const seedInfo = await zano.get_seed_phrase_info(seed, seedPassword);
console.log(`Valid: ${seedInfo.response_data.syntax_correct}`);

// Get address info
const addressInfo = await zano.get_address_info(address);
console.log(`Is valid: ${addressInfo.valid}`);

// Check connectivity
const status = await zano.get_connectivity_status();
console.log(`Online: ${status.is_online}`);

// Library version
const version = await zano.get_lib_version();
```

### ZanoWalletInstance (Wallet Operations)

Represents an opened wallet with 50+ typed methods.

#### Balance & Info

```typescript
// Get balance
const balance = await wallet.getbalance();
console.log(`Total: ${balance.balance}`);
console.log(`Unlocked: ${balance.unlocked_balance}`);

// Get address
const address = await wallet.getaddress();

// Get detailed wallet info
const info = await wallet.get_wallet_info();
console.log(`Balances:`, info.wi.balances);
console.log(`Mining enabled: ${info.wi.is_mining}`);
```

#### Transactions

```typescript
// Simple transfer
const tx = await wallet.transfer({
  destinations: [{ address: 'ZxABC...', amount: 1000000000000 }],
  fee: 10000000000,
  mixin: 10
});

// Transfer with multiple destinations and options
const tx = await wallet.transfer({
  destinations: [
    { address: 'ZxABC...', amount: 500000000000 },
    { address: 'ZxDEF...', amount: 300000000000 }
  ],
  fee: 10000000000,
  mixin: 10,
  comment: 'Payment for services',
  hide_receiver: false
});

// Sign and submit separately
const signedTx = await wallet.sign_transfer({
  destinations: [...],
  fee: 10000000000
});
const result = await wallet.submit_transfer(signedTx.tx_unsigned_hex);

// Sweep dust (amounts below threshold)
const swept = await wallet.sweep_below({
  address: 'ZxABC...',
  amount: 1000000000,
  fee: 10000000000
});
```

#### Transaction History

```typescript
// Get recent transactions
const recent = await wallet.get_recent_txs_and_info({
  offset: 0,
  count: 10
});

// Get recent with filter
const filtered = await wallet.get_recent_txs_and_info2({
  offset: 0,
  count: 20,
  exclude_mining_txs: true,
  exclude_unconfirmed: false
});

// Search transactions
const search = await wallet.search_for_transactions({
  tx_id: '...',
  in: true,
  out: true,
  pending: true,
  failed: true
});
```

#### Assets

```typescript
// Get whitelisted assets
const assets = await wallet.assets_whitelist_get();

// Add asset to whitelist
await wallet.assets_whitelist_add({ asset_id: '...' });

// Deploy new asset
const asset = await wallet.deploy_asset({
  ticker: 'TEST',
  full_name: 'Test Asset',
  decimal_point: 12,
  total_max_supply: 1000000000000000
});

// Emit additional supply
await wallet.emit_asset({
  asset_id: '...',
  amount: 100000000000
});

// Burn assets
await wallet.burn_asset({
  asset_id: '...',
  amount: 50000000000
});
```

#### Marketplace

```typescript
// Get offers
const offers = await wallet.marketplace_get_offers_ex({
  filter: {
    order_by: 0, // by timestamp
    offset: 0,
    limit: 20
  }
});

// Push new offer
const offer = await wallet.marketplace_push_offer({
  od: {
    offer_type: 1,
    amount_primary: 1000000000000,
    amount_target: 500000000000,
    // ... more fields
  }
});

// Cancel offer
await wallet.marketplace_cancel_offer({
  tx_id: '...',
  offer_index: 0
});
```

#### Ionic Swaps

```typescript
// Generate swap proposal
const proposal = await wallet.ionic_swap_generate_proposal({
  proposal: {
    to_finalizer: {
      address: 'ZxABC...',
      amount: 1000000000000,
      asset_id: '...'
    },
    to_initiator: {
      address: 'ZxDEF...',
      amount: 500000000000,
      asset_id: '...'
    }
  }
});

// Accept proposal
const accepted = await wallet.ionic_swap_accept_proposal({
  hex_raw_proposal: proposal.hex_raw_proposal
});
```

#### Aliases

```typescript
// Register alias
const alias = await wallet.register_alias({
  alias: {
    alias: 'myalias',
    address: wallet.wi.address,
    comment: 'My personal alias'
  }
});

// Update alias
await wallet.update_alias({
  alias: {
    alias: 'myalias',
    address: newAddress
  }
});
```

#### Cryptography

```typescript
// Sign message
const signature = await wallet.sign_message({
  message: 'Hello, Zano!'
});

// Encrypt data
const encrypted = await wallet.encrypt_data({
  plain_text: 'Secret data'
});

// Decrypt data
const decrypted = await wallet.decrypt_data({
  cipher_text: encrypted.cipher_text
});
```

### Daemon RPC API

Access blockchain daemon methods through `zano.daemon`:

#### Block Methods

```typescript
// Get block count
const count = await zano.daemon.getblockcount();

// Get last block header
const header = await zano.daemon.getlastblockheader();

// Get block details
const blocks = await zano.daemon.get_blocks_details({
  height_start: 0,
  count: 10
});

// Get block header by hash
const header = await zano.daemon.getblockheaderbyhash({
  hash: '...'
});
```

#### Alias Methods

```typescript
// Get alias details
const alias = await zano.daemon.get_alias_details({
  alias: 'dev'
});

// Get alias by address
const aliases = await zano.daemon.get_alias_by_address({
  address: 'ZxABC...'
});

// Get alias reward
const reward = await zano.daemon.get_alias_reward({
  alias: 'myalias'
});
```

#### Asset Methods

```typescript
// Get asset info
const asset = await zano.daemon.get_asset_info({
  asset_id: '...'
});

// Get all assets
const assets = await zano.daemon.get_assets_list();
```

#### Network Methods

```typescript
// Get network info
const info = await zano.daemon.get_info();

// Get pool transactions
const pool = await zano.daemon.get_pool_txs_details();

// Get transaction details
const tx = await zano.daemon.get_tx_details({
  tx_hash: '...'
});
```

#### Marketplace Methods

```typescript
// Get global marketplace offers
const offers = await zano.daemon.marketplace_global_get_offers_ex({
  filter: {
    order_by: 0,
    offset: 0,
    limit: 50
  }
});
```

#### Other Methods

```typescript
// Validate signature
const valid = await zano.daemon.validate_signature({
  message: '...',
  signature: '...',
  address: 'ZxABC...'
});

// Search by ID (transaction, alias, etc.)
const result = await zano.daemon.search_by_id({
  id: '...'
});
```

### ZanoAppConfig (Encrypted Storage)

Type-safe encrypted configuration storage:

```typescript
interface MyAppConfig {
  theme: 'light' | 'dark';
  language: string;
  walletName: string;
}

// Initialize config
const config = new ZanoAppConfig<MyAppConfig>();
await config.initialize();

// Set config
await config.set({
  theme: 'dark',
  language: 'en',
  walletName: 'MyWallet'
});

// Get config
const settings = await config.get();
console.log(settings.theme); // 'dark'
```

## Platform-Specific Features

### Directory Access

The plugin automatically detects platform-specific directories:

```typescript
// Android: /data/data/<package>/files
// iOS: /var/mobile/Containers/Data/Application/<UUID>/Documents
console.log(`Working: ${zano.working_directory}`);

// Android: /storage/emulated/0/Download
// iOS: /Documents/Downloads
console.log(`Downloads: ${zano.downloads_directory}`);
```

### Seed Phrase Validation

Validate seed phrases without opening a wallet:

```typescript
const info = await zano.get_seed_phrase_info(
  'word1 word2 word3 ...',
  '' // seed password (optional)
);

if (info.response_data.syntax_correct) {
  console.log('Valid seed phrase!');
  console.log(`Requires password: ${info.response_data.require_password}`);
  console.log(`Tracking seed: ${info.response_data.tracking_seed}`);
}
```

## Low-Level API (Legacy)

The original low-level API is still available for backward compatibility:

### Initialization

- `ZanoWallet.init(address, workingDir, logLevel)` - Initialize wallet library
- `ZanoWallet.reset()` - Close all wallets
- `ZanoWallet.setLogLevel(level)` - Set logging level
- `ZanoWallet.getVersion()` - Get library version

### Wallet Management

- `ZanoWallet.generate(path, password)` - Create new wallet
- `ZanoWallet.open(path, password)` - Open existing wallet
- `ZanoWallet.restore(seed, path, password, seedPassword)` - Restore from seed
- `ZanoWallet.closeWallet(walletId)` - Close wallet
- `ZanoWallet.deleteWallet(fileName)` - Delete wallet file
- `ZanoWallet.getOpenedWallets()` - List opened wallets

### Wallet Operations

- `ZanoWallet.getWalletStatus(walletId)` - Get sync status
- `ZanoWallet.getWalletInfo(walletId)` - Get detailed wallet info
- `ZanoWallet.invoke(walletId, params)` - Call wallet RPC methods
- `ZanoWallet.resetWalletPassword(walletId, newPassword)` - Change password

### Utility Functions

- `ZanoWallet.getWalletFiles()` - List wallet files
- `ZanoWallet.getAddressInfo(address)` - Validate address
- `ZanoWallet.getConnectivityStatus()` - Check network status
- `ZanoWallet.generateRandomKey(length)` - Generate secure random key
- `ZanoWallet.getLogsBuffer()` - Get debug logs

### Asynchronous Operations

- `ZanoWallet.asyncCall(methodName, walletId, params)` - Start async operation
- `ZanoWallet.tryPullResult(jobId)` - Poll for result
- `ZanoWallet.pollAsyncResult(jobId)` - Auto-poll until complete
- `ZanoWallet.asyncCallAndWait(methodName, walletId, params)` - Call and wait

### Configuration

- `ZanoWallet.setAppConfig(confStr, encryptionKey)` - Save encrypted config
- `ZanoWallet.getAppConfig(encryptionKey)` - Load encrypted config

### New Methods

- `ZanoWallet.getWorkingDirectory()` - Get platform working directory
- `ZanoWallet.getDownloadsDirectory()` - Get platform downloads directory
- `ZanoWallet.getSeedPhraseInfo(seed, seedPassword)` - Validate seed phrase
- `ZanoWallet.daemonCall(method, params)` - Call daemon RPC method

## Platform-Specific Notes

### Android

- Minimum SDK version: 23 (Android 6.0)
- JNI bridge to C++ native library
- Native libraries for arm64-v8a, armeabi-v7a, x86, x86_64
- Working directory: `/data/data/<package>/files`
- Downloads directory: `/storage/emulated/0/Download` (may require permissions)

### iOS

- Minimum iOS version: 12.0
- Objective-C++ bridge to C++ native library
- XCFrameworks for universal architecture support
- Working directory: `/var/mobile/Containers/Data/Application/<UUID>/Documents`
- Downloads directory: `/Documents/Downloads` (sandboxed)

## Building from Source

To rebuild the native libraries:

```bash
# Android
cd /path/to/zano_native_lib
./build_android_libs.sh

# iOS
cd /path/to/zano_native_lib
./build_ios_libs.sh
```

The build artifacts will be placed in `_install_android/` and `_install_ios/` respectively.

## TypeScript Build

To rebuild the TypeScript source:

```bash
cd cordova-plugin-zano-wallet

# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run build:watch
```

## Troubleshooting

### Android Build Issues

**Problem:** Native library not found
```
Solution: Ensure all static libraries are present in _install_android/{ABI}/lib/
Run build_android_libs.sh to rebuild them.
```

**Problem:** CMake version error
```
Solution: Update NDK to r21 or later, or adjust CMakeLists.txt minimum version.
```

### iOS Build Issues

**Problem:** Framework not found
```
Solution: Verify all XCFrameworks exist in _install_ios/lib/
Run build_ios_libs.sh to generate them.
```

**Problem:** Architecture mismatch
```
Solution: Ensure XCFrameworks include both arm64 (device) and x86_64/arm64 (simulator) slices.
```

### Runtime Issues

**Problem:** Wallet operations fail or timeout
```
Solution:
1. Check network connectivity
2. Verify daemon address is reachable
3. Ensure working directory has write permissions
4. Check logs with getLogsBuffer()
```

**Problem:** TypeScript compilation errors
```
Solution:
1. Ensure TypeScript version 5.3+ is installed
2. Run 'npm install' to install dependencies
3. Check tsconfig.json for correct paths
4. Run 'npm run clean && npm run build'
```

## Example App

See the [example](./example) directory for a complete Cordova application demonstrating all features.

## Documentation

- [Quick Start Guide](QUICKSTART.md) - Step-by-step setup and basic usage
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Technical details
- [Native Implementations](NATIVE_IMPLEMENTATIONS_COMPLETE.md) - Native bridge documentation

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please submit issues and pull requests on GitHub.

## Support

For questions and support:
- GitHub Issues: https://github.com/zano/cordova-plugin-zano-wallet/issues
- Zano Community: https://zano.org

## Changelog

### 2.0.0 (Current)

**Major Update - TypeScript Rewrite**

- **TypeScript-First API** - Complete rewrite with 100+ typed methods
- **High-Level Classes** - ZanoController, ZanoWalletInstance, ZanoWalletFile, ZanoAppConfig
- **Daemon RPC Access** - 30+ daemon methods for blockchain queries
- **Platform Utilities** - Directory access, seed phrase validation
- **Feature Parity** - Matches React Native implementation
- **Backward Compatible** - Low-level API still available

**New Features:**
- `ZanoController` - Main API controller with daemon access
- `ZanoWalletInstance` - 50+ typed wallet operation methods
- `ZanoAppConfig<T>` - Generic typed configuration storage
- `getWorkingDirectory()` - Platform-specific app directory
- `getDownloadsDirectory()` - Platform-specific downloads directory
- `getSeedPhraseInfo()` - Seed phrase validation
- `daemonCall()` - Direct daemon RPC access
- Full daemon API: blocks, aliases, assets, marketplace, network info

**Native Implementations:**
- Android JNI: Added 4 new native functions
- iOS Objective-C++: Added 4 new native methods
- Improved platform directory detection

**Build System:**
- Added TypeScript compilation pipeline
- Source maps and type declarations
- Strict type checking
- NPM build scripts

### 1.0.0

- Initial release
- Android and iOS support
- Full Zano wallet API coverage
- Async operation support
- Basic TypeScript definitions
