# Quick Start Guide

This guide will help you get started with the Zano Wallet Cordova plugin using the new TypeScript API.

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

## 5. TypeScript Setup (Recommended)

For TypeScript support in your Cordova app:

```bash
# Install TypeScript and types
npm install --save-dev typescript @types/cordova

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["www/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
```

## 6. Basic Usage Example (TypeScript)

Create `www/js/app.ts`:

```typescript
import { ZanoController } from 'cordova-plugin-zano-wallet';

document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
    console.log('Device ready, initializing Zano Wallet...');

    try {
        // Create controller instance
        const zano = new ZanoController('https://node.zano.org:443');

        // Initialize (auto-detects platform directories)
        await zano.initialize();

        console.log('Zano Wallet initialized!');
        console.log('Working directory:', zano.working_directory);
        console.log('Downloads directory:', zano.downloads_directory);

        // Get library version
        const version = await zano.get_lib_version();
        console.log('Library version:', version);
        document.getElementById('version')!.textContent = version;

        // Generate a new wallet
        console.log('Generating wallet...');
        const wallet = await zano.generate_wallet('test_wallet', 'password123');

        console.log('Wallet created!');
        console.log('Wallet ID:', wallet.wallet_id);
        console.log('Address:', wallet.wi.address);

        // Display wallet info
        document.getElementById('address')!.textContent = wallet.wi.address;

        // Get balance
        const balance = await wallet.getbalance();
        console.log('Balance:', balance.balance);
        document.getElementById('balance')!.textContent =
            `${balance.balance} (Unlocked: ${balance.unlocked_balance})`;

        // Use daemon API
        const blockCount = await zano.daemon.getblockcount();
        console.log('Block count:', blockCount.count);
        document.getElementById('blockcount')!.textContent = blockCount.count.toString();

        // Check connectivity
        const status = await zano.get_connectivity_status();
        console.log('Online:', status.is_online);
        document.getElementById('status')!.textContent =
            status.is_online ? 'Connected' : 'Offline';

    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error);
    }
}
```

## 7. HTML Interface

Edit `www/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Zano Wallet</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-top: 0; }
        .info-row {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; word-break: break-all; }
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status.online { background: #4caf50; color: white; }
        .status.offline { background: #f44336; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Zano Wallet</h1>

        <div class="info-row">
            <div class="label">Library Version</div>
            <div class="value" id="version">Initializing...</div>
        </div>

        <div class="info-row">
            <div class="label">Status</div>
            <div class="value">
                <span class="status" id="status">Connecting...</span>
            </div>
        </div>

        <div class="info-row">
            <div class="label">Block Count</div>
            <div class="value" id="blockcount">-</div>
        </div>

        <div class="info-row">
            <div class="label">Wallet Address</div>
            <div class="value" id="address" style="font-size: 11px;">-</div>
        </div>

        <div class="info-row">
            <div class="label">Balance</div>
            <div class="value" id="balance">-</div>
        </div>
    </div>

    <script src="cordova.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

## 8. Alternative: JavaScript (Classic API)

If not using TypeScript, edit `www/js/index.js`:

```javascript
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Device ready, initializing Zano Wallet...');

    // Get appropriate working directory
    const workingDir = cordova.file.dataDirectory;

    // Initialize the wallet library
    ZanoWallet.init('https://node.zano.org:443', workingDir, 0)
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

            // Get wallet status
            return ZanoWallet.getWalletStatus(result.result.wallet_id);
        })
        .then(status => {
            console.log('Wallet status:', status);
            document.getElementById('status').textContent =
                status.is_in_sync ? 'Synced' : 'Syncing...';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error);
        });
}
```

## 9. Build and Run

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

## 10. Common Operations

### Open Existing Wallet

```typescript
// TypeScript
const walletFile = zano.wallet_files.find(w => w.name === 'test_wallet');
if (walletFile) {
    const wallet = await walletFile.open('password123');
    console.log('Wallet opened, ID:', wallet.wallet_id);

    const info = await wallet.get_wallet_info();
    console.log('Balance:', info.wi.balances);
}

// JavaScript (Classic)
ZanoWallet.open('test_wallet', 'password123')
    .then(result => {
        const walletId = result.result.wallet_id;
        console.log('Wallet ID:', walletId);
        return ZanoWallet.getWalletStatus(walletId);
    })
    .then(status => {
        console.log('Sync progress:', status.progress);
    });
```

### Restore from Seed

```typescript
// TypeScript
const wallet = await zano.restore_wallet(
    'your 25 word seed phrase here...',
    'restored_wallet',
    'newpassword',
    '' // seed password (optional)
);
console.log('Wallet restored, ID:', wallet.wallet_id);

// JavaScript (Classic)
const seed = 'your 25 word seed phrase here...';
ZanoWallet.restore(seed, 'restored_wallet', 'newpassword', '')
    .then(result => {
        console.log('Wallet restored successfully');
        console.log('Wallet ID:', result.result.wallet_id);
    });
```

### Validate Seed Phrase

```typescript
// TypeScript only (new feature)
const seedInfo = await zano.get_seed_phrase_info(
    'word1 word2 word3 ...',
    ''
);

if (seedInfo.response_data.syntax_correct) {
    console.log('Valid seed phrase!');
    console.log('Requires password:', seedInfo.response_data.require_password);
} else {
    console.log('Invalid seed phrase');
}
```

### Get Balance

```typescript
// TypeScript
const balance = await wallet.getbalance();
console.log('Total:', balance.balance);
console.log('Unlocked:', balance.unlocked_balance);

// Get detailed balance with all assets
const info = await wallet.get_wallet_info();
info.wi.balances.forEach(bal => {
    console.log(`Asset: ${bal.asset_info.ticker}`);
    console.log(`Total: ${bal.total}`);
    console.log(`Unlocked: ${bal.unlocked}`);
});

// JavaScript (Classic)
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

### Make Transfer

```typescript
// TypeScript
const tx = await wallet.transfer({
    destinations: [{
        amount: 1000000000000, // Amount in atomic units
        address: 'ZxABC...'
    }],
    fee: 10000000000,
    mixin: 10,
    comment: 'Payment for services'
});
console.log('Transaction sent:', tx.tx_hash);

// JavaScript (Classic)
const transferParams = {
    method: 'transfer',
    params: {
        destinations: [{
            amount: 1000000000000,
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

### Use Daemon API

```typescript
// TypeScript only (new feature)

// Get blockchain info
const info = await zano.daemon.get_info();
console.log('Network height:', info.height);
console.log('Difficulty:', info.difficulty);

// Get alias details
const alias = await zano.daemon.get_alias_details({ alias: 'dev' });
console.log('Alias address:', alias.address);

// Get asset info
const asset = await zano.daemon.get_asset_info({
    asset_id: 'your_asset_id'
});
console.log('Asset name:', asset.full_name);

// Get marketplace offers
const offers = await zano.daemon.marketplace_global_get_offers_ex({
    filter: {
        order_by: 0,
        offset: 0,
        limit: 20
    }
});
console.log('Offers:', offers.offers.length);
```

## 11. Debugging

### Enable Logging

```typescript
// TypeScript
import { ZanoLogLevel } from 'cordova-plugin-zano-wallet';

const zano = new ZanoController(
    'https://node.zano.org:443',
    ZanoLogLevel.VERBOSE
);

// JavaScript (Classic)
ZanoWallet.setLogLevel(1); // 0 = default, 1 = verbose, -1 = disabled

// View logs
ZanoWallet.getLogsBuffer()
    .then(logs => {
        console.log('Wallet logs:', logs);
    });
```

### Check Connectivity

```typescript
// TypeScript
const status = await zano.get_connectivity_status();
console.log('Online:', status.is_online);
console.log('Daemon connected:', status.is_daemon_connected);
console.log('Daemon height:', status.last_daemon_height);

// JavaScript (Classic)
ZanoWallet.getConnectivityStatus()
    .then(status => {
        console.log('Online:', status.is_online);
        console.log('Connected:', status.is_daemon_connected);
    });
```

### Monitor Wallet Sync

```typescript
// TypeScript
const status = await wallet.getStatus();
console.log('Wallet height:', status.current_wallet_height);
console.log('Daemon height:', status.current_daemon_height);
console.log('Progress:', status.progress);
console.log('In sync:', status.is_in_sync);

// JavaScript (Classic)
ZanoWallet.getWalletStatus(walletId)
    .then(status => {
        console.log('Progress:', status.progress);
        console.log('Daemon height:', status.current_daemon_height);
        console.log('Wallet height:', status.current_wallet_height);
    });
```

## 12. Advanced Features

### Encrypted App Configuration

```typescript
interface MyAppConfig {
    theme: 'light' | 'dark';
    language: string;
    defaultWallet: string;
}

// Initialize config storage
const config = new ZanoAppConfig<MyAppConfig>();
await config.initialize();

// Save settings
await config.set({
    theme: 'dark',
    language: 'en',
    defaultWallet: 'my_wallet'
});

// Load settings
const settings = await config.get();
console.log('Theme:', settings.theme);
```

### Asset Management

```typescript
// Get whitelisted assets
const assets = await wallet.assets_whitelist_get();

// Deploy new asset
const newAsset = await wallet.deploy_asset({
    ticker: 'MYTOKEN',
    full_name: 'My Custom Token',
    decimal_point: 12,
    total_max_supply: 1000000000000000
});

// Emit more supply
await wallet.emit_asset({
    asset_id: newAsset.asset_id,
    amount: 100000000000
});
```

### Marketplace Operations

```typescript
// Get offers
const offers = await wallet.marketplace_get_offers_ex({
    filter: {
        order_by: 0,
        offset: 0,
        limit: 20
    }
});

// Create offer
const offer = await wallet.marketplace_push_offer({
    od: {
        offer_type: 1,
        amount_primary: 1000000000000,
        amount_target: 500000000000,
        // ... more fields
    }
});
```

## 13. Next Steps

- Review the [full API documentation](README.md)
- Explore all available methods in TypeScript with IntelliSense
- Read the [Implementation Summary](IMPLEMENTATION_SUMMARY.md) for technical details
- Check the [Native Implementations](NATIVE_IMPLEMENTATIONS_COMPLETE.md) documentation
- Explore the Zano wallet RPC API for advanced operations

## 14. Migration from 1.0 to 2.0

If you're upgrading from version 1.0:

### Old API (Still works)
```javascript
ZanoWallet.init(node, workingDir, 0);
ZanoWallet.generate('wallet', 'pass');
ZanoWallet.invoke(walletId, { method: 'transfer', params: {...} });
```

### New API (Recommended)
```typescript
const zano = new ZanoController(node);
await zano.initialize();
const wallet = await zano.generate_wallet('wallet', 'pass');
await wallet.transfer({...});
```

**Benefits of new API:**
- Full TypeScript support with IntelliSense
- Object-oriented design
- 100+ typed methods vs manual JSON
- Daemon RPC access built-in
- Better error handling

## Support

- GitHub Issues: https://github.com/zano/cordova-plugin-zano-wallet/issues
- Zano Documentation: https://zano.org/docs
- Community: https://zano.org/community
