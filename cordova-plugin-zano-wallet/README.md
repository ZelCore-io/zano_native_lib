# cordova-plugin-zano-wallet

Cordova plugin for integrating Zano cryptocurrency wallet functionality into hybrid mobile applications on Android and iOS.

## Features

- Full access to Zano wallet C++ native library
- Wallet creation, restoration from seed, and management
- Balance queries and transaction operations
- Asynchronous operation support with job polling
- TypeScript definitions included
- Cross-platform (Android & iOS)

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

### Build native libraries yourself

Only needed if you want to customize or update the native code:

```bash
# In the zano_native_lib repository root
./build_android_libs.sh  # For Android
./build_ios_libs.sh      # For iOS
```

## Usage

### JavaScript/TypeScript

```javascript
// Initialize the wallet library
const workingDir = cordova.file.dataDirectory; // iOS/Android appropriate path
ZanoWallet.init('http://127.0.0.1:2222', workingDir, 0)
  .then(result => console.log('Initialized:', result))
  .catch(error => console.error('Init failed:', error));

// Generate a new wallet
ZanoWallet.generate('my_wallet', 'password123')
  .then(result => {
    console.log('Wallet created!');
    console.log('Address:', result.result.wi.address);
    console.log('Seed:', result.result.seed);
    console.log('Wallet ID:', result.result.wallet_id);
  });

// Open existing wallet
ZanoWallet.open('my_wallet', 'password123')
  .then(result => {
    const walletId = result.result.wallet_id;
    console.log('Wallet opened, ID:', walletId);

    // Get wallet status
    return ZanoWallet.getWalletStatus(walletId);
  })
  .then(status => {
    console.log('Sync status:', status);
  });

// Restore from seed
const seed = 'invite invite invite...';
ZanoWallet.restore(seed, 'restored_wallet', 'newpass', '')
  .then(result => {
    console.log('Wallet restored:', result.result.wallet_id);
  });

// Get balance and wallet info
ZanoWallet.getOpenedWallets()
  .then(result => {
    result.result.forEach(wallet => {
      console.log('Wallet:', wallet.wi.address);
      console.log('Balances:', wallet.wi.balances);
    });
  });

// Use async operations for heavy tasks
ZanoWallet.asyncCallAndWait('invoke', walletId, {
  method: 'transfer',
  params: {
    destinations: [{ amount: 1000000000000, address: 'ZxABC...' }],
    fee: 10000000000,
    mixin: 10
  }
})
.then(result => {
  console.log('Transfer completed:', result);
})
.catch(error => {
  console.error('Transfer failed:', error);
});

// Close wallet when done
ZanoWallet.closeWallet(walletId)
  .then(() => console.log('Wallet closed'));
```

### TypeScript

The plugin includes TypeScript definitions:

```typescript
import ZanoWallet from 'cordova-plugin-zano-wallet';

async function example() {
  // TypeScript will provide autocompletion and type checking
  const result = await ZanoWallet.generate('wallet_name', 'password');
  const walletId: number = result.result.wallet_id;
  const address: string = result.result.wi.address;

  const status = await ZanoWallet.getWalletStatus(walletId);
  console.log('Height:', status.current_wallet_height);
}
```

## API Reference

### Initialization

- `init(address, workingDir, logLevel)` - Initialize wallet library
- `reset()` - Close all wallets
- `setLogLevel(level)` - Set logging level
- `getVersion()` - Get library version

### Wallet Management

- `generate(path, password)` - Create new wallet
- `open(path, password)` - Open existing wallet
- `restore(seed, path, password, seedPassword)` - Restore from seed
- `closeWallet(walletId)` - Close wallet
- `deleteWallet(fileName)` - Delete wallet file
- `getOpenedWallets()` - List opened wallets

### Wallet Operations

- `getWalletStatus(walletId)` - Get sync status
- `getWalletInfo(walletId)` - Get detailed wallet info
- `invoke(walletId, params)` - Call wallet RPC methods
- `resetWalletPassword(walletId, newPassword)` - Change password

### Utility Functions

- `getWalletFiles()` - List wallet files
- `getAddressInfo(address)` - Validate address
- `getConnectivityStatus()` - Check network status
- `generateRandomKey(length)` - Generate secure random key
- `getLogsBuffer()` - Get debug logs

### Asynchronous Operations

- `asyncCall(methodName, walletId, params)` - Start async operation
- `tryPullResult(jobId)` - Poll for result
- `pollAsyncResult(jobId)` - Auto-poll until complete
- `asyncCallAndWait(methodName, walletId, params)` - Call and wait for result

### Configuration

- `setAppConfig(confStr, encryptionKey)` - Save encrypted config
- `getAppConfig(encryptionKey)` - Load encrypted config

For complete API documentation, see the [main README](../README.md).

## Platform-Specific Notes

### Android

- Minimum SDK version: 23 (Android 6.0)
- The plugin uses JNI to bridge Java to C++
- Native libraries are built for arm64-v8a, armeabi-v7a, x86, and x86_64

### iOS

- Minimum iOS version: 12.0
- Uses Objective-C++ bridge
- XCFrameworks are used for architecture-independent libraries
- Ensure your project has C++ support enabled

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

## Example App

See the [example](./example) directory for a complete Cordova application demonstrating all features.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please submit issues and pull requests on GitHub.

## Support

For questions and support:
- GitHub Issues: https://github.com/zano/cordova-plugin-zano-wallet/issues
- Zano Community: https://zano.org

## Changelog

### 1.0.0
- Initial release
- Android and iOS support
- Full Zano wallet API coverage
- Async operation support
- TypeScript definitions
