# Quick Start Guide

This guide will help you get started with the Zano Wallet Cordova plugin.

## 1. Prerequisites

### For Android Development
- Node.js 14+ and npm
- Cordova CLI: `npm install -g cordova`
- Android Studio with NDK r21+
- Java JDK 8 or 11

### For iOS Development
- macOS with Xcode 12+
- Cordova CLI
- CocoaPods (optional but recommended)

## 2. Build Native Libraries

Before installing the plugin, you must build the native Zano libraries:

```bash
# Navigate to the parent repository
cd /path/to/zano_native_lib

# Build for Android (requires NDK)
./build_android_libs.sh

# Build for iOS (requires Xcode)
./build_ios_libs.sh
```

This will generate:
- Android libraries in `_install_android/`
- iOS libraries in `_install_ios/`

## 3. Create a Cordova Project

```bash
# Create new Cordova project
cordova create MyZanoApp com.example.zanoapp MyZanoApp
cd MyZanoApp

# Add platforms
cordova platform add android
cordova platform add ios
```

## 4. Install the Plugin

```bash
# Install from local path
cordova plugin add /path/to/zano_native_lib/cordova-plugin-zano-wallet

# Verify installation
cordova plugin list
```

## 5. Basic Usage Example

Edit `www/js/index.js`:

```javascript
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Device ready, initializing Zano Wallet...');

    // Get appropriate working directory
    const workingDir = cordova.file.dataDirectory;

    // Initialize the wallet library
    ZanoWallet.init('http://127.0.0.1:11211', workingDir, 0)
        .then(result => {
            console.log('Zano Wallet initialized:', result);
            return ZanoWallet.getVersion();
        })
        .then(version => {
            console.log('Wallet version:', version);
            document.getElementById('version').textContent = version;

            // Generate a new wallet
            return ZanoWallet.generate('test_wallet', 'password123');
        })
        .then(result => {
            console.log('Wallet created!');
            console.log('Address:', result.result.wi.address);
            console.log('Seed:', result.result.seed);

            // Display wallet info
            document.getElementById('address').textContent = result.result.wi.address;
            document.getElementById('seed').textContent = result.result.seed;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error);
        });
}
```

Edit `www/index.html` to add display elements:

```html
<div class="app">
    <h1>Zano Wallet</h1>
    <div id="deviceready" class="blink">
        <p class="event listening">Connecting to Device</p>
        <p class="event received">Device is Ready</p>
    </div>
    <div>
        <h2>Wallet Info</h2>
        <p><strong>Version:</strong> <span id="version">-</span></p>
        <p><strong>Address:</strong> <span id="address">-</span></p>
        <p><strong>Seed:</strong> <span id="seed" style="font-size:10px;">-</span></p>
    </div>
</div>
```

## 6. Build and Run

### Android

```bash
# Build
cordova build android

# Run on device/emulator
cordova run android

# Or open in Android Studio
cordova prepare android
# Then open platforms/android in Android Studio
```

### iOS

```bash
# Build
cordova build ios

# Run on simulator
cordova run ios

# Or open in Xcode
cordova prepare ios
# Then open platforms/ios/*.xcworkspace in Xcode
```

## 7. Common Operations

### Open Existing Wallet

```javascript
ZanoWallet.open('my_wallet', 'password')
    .then(result => {
        const walletId = result.result.wallet_id;
        console.log('Wallet ID:', walletId);
        return ZanoWallet.getWalletStatus(walletId);
    })
    .then(status => {
        console.log('Sync progress:', status.progress);
        console.log('Daemon height:', status.current_daemon_height);
        console.log('Wallet height:', status.current_wallet_height);
    });
```

### Restore from Seed

```javascript
const seed = 'your 25 word seed phrase here...';
ZanoWallet.restore(seed, 'restored_wallet', 'newpassword', '')
    .then(result => {
        console.log('Wallet restored successfully');
        console.log('Wallet ID:', result.result.wallet_id);
    });
```

### Get Balance

```javascript
ZanoWallet.getOpenedWallets()
    .then(result => {
        const wallet = result.result[0];
        wallet.wi.balances.forEach(balance => {
            console.log('Asset:', balance.asset_info.ticker);
            console.log('Total:', balance.total);
            console.log('Unlocked:', balance.unlocked);
        });
    });
```

### Make Transfer (using async API)

```javascript
const transferParams = {
    method: 'transfer',
    params: {
        destinations: [{
            amount: 1000000000000, // Amount in atomic units
            address: 'ZxABC...'
        }],
        fee: 10000000000,
        mixin: 10
    }
};

ZanoWallet.asyncCallAndWait('invoke', walletId, transferParams)
    .then(result => {
        console.log('Transfer successful!');
        console.log('TX ID:', result.result.tx_hash);
    })
    .catch(error => {
        console.error('Transfer failed:', error);
    });
```

## 8. Debugging

### Enable Logging

```javascript
// Set log level (0 = default, 1 = verbose, -1 = disabled)
ZanoWallet.setLogLevel(1);

// View logs
ZanoWallet.getLogsBuffer()
    .then(logs => {
        console.log('Wallet logs:', logs);
    });
```

### Check Connectivity

```javascript
ZanoWallet.getConnectivityStatus()
    .then(status => {
        console.log('Online:', status.is_online);
        console.log('Connected:', status.is_daemon_connected);
    });
```

## 9. TypeScript Support

If using TypeScript in your Cordova project:

```typescript
/// <reference types="cordova-plugin-zano-wallet" />

async function initWallet() {
    const workingDir = cordova.file.dataDirectory;
    await ZanoWallet.init('http://127.0.0.1:11211', workingDir, 0);

    const result = await ZanoWallet.generate('wallet', 'pass');
    const walletId: number = result.result.wallet_id;

    // TypeScript provides full autocomplete and type checking
    const status = await ZanoWallet.getWalletStatus(walletId);
    console.log(status.current_wallet_height);
}
```

## 10. Next Steps

- Review the [full API documentation](README.md)
- Check the [example app](./example) for more complex usage
- Read the [troubleshooting guide](README.md#troubleshooting)
- Explore the Zano wallet RPC API for advanced operations

## Support

- GitHub Issues: https://github.com/zano/cordova-plugin-zano-wallet/issues
- Zano Documentation: https://zano.org/docs
