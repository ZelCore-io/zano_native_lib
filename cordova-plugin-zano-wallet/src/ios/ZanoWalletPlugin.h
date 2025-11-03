#import <Cordova/CDVPlugin.h>

@interface ZanoWalletPlugin : CDVPlugin

// Initialization
- (void)init:(CDVInvokedUrlCommand*)command;
- (void)initWithIpPort:(CDVInvokedUrlCommand*)command;

// Utility
- (void)reset:(CDVInvokedUrlCommand*)command;
- (void)setLogLevel:(CDVInvokedUrlCommand*)command;
- (void)getVersion:(CDVInvokedUrlCommand*)command;
- (void)getWalletFiles:(CDVInvokedUrlCommand*)command;
- (void)getExportPrivateInfo:(CDVInvokedUrlCommand*)command;
- (void)deleteWallet:(CDVInvokedUrlCommand*)command;
- (void)getAddressInfo:(CDVInvokedUrlCommand*)command;
- (void)getWorkingDirectory:(CDVInvokedUrlCommand*)command;
- (void)getDownloadsDirectory:(CDVInvokedUrlCommand*)command;
- (void)getSeedPhraseInfo:(CDVInvokedUrlCommand*)command;

// Configuration
- (void)setAppConfig:(CDVInvokedUrlCommand*)command;
- (void)getAppConfig:(CDVInvokedUrlCommand*)command;
- (void)generateRandomKey:(CDVInvokedUrlCommand*)command;
- (void)getLogsBuffer:(CDVInvokedUrlCommand*)command;
- (void)truncateLog:(CDVInvokedUrlCommand*)command;
- (void)getConnectivityStatus:(CDVInvokedUrlCommand*)command;

// Wallet Management
- (void)open:(CDVInvokedUrlCommand*)command;
- (void)restore:(CDVInvokedUrlCommand*)command;
- (void)generate:(CDVInvokedUrlCommand*)command;
- (void)getOpenedWallets:(CDVInvokedUrlCommand*)command;

// Wallet Operations
- (void)getWalletStatus:(CDVInvokedUrlCommand*)command;
- (void)closeWallet:(CDVInvokedUrlCommand*)command;
- (void)invoke:(CDVInvokedUrlCommand*)command;

// Async Operations
- (void)asyncCall:(CDVInvokedUrlCommand*)command;
- (void)tryPullResult:(CDVInvokedUrlCommand*)command;

// Cake Wallet Extensions
- (void)isWalletExist:(CDVInvokedUrlCommand*)command;
- (void)getWalletInfo:(CDVInvokedUrlCommand*)command;
- (void)resetWalletPassword:(CDVInvokedUrlCommand*)command;
- (void)getCurrentTxFee:(CDVInvokedUrlCommand*)command;

// Daemon RPC
- (void)daemonCall:(CDVInvokedUrlCommand*)command;

@end
