#import "ZanoWalletPlugin.h"
#import <Cordova/CDVPlugin.h>

// Include C++ wallet API headers
#include "plain_wallet_api.h"
#include <string>

@implementation ZanoWalletPlugin

#pragma mark - Helper Methods

/**
 * Helper to convert NSString to std::string
 */
- (std::string)stringFromNSString:(NSString*)nsString {
    if (nsString == nil) {
        return "";
    }
    return std::string([nsString UTF8String]);
}

/**
 * Helper to convert std::string to NSString
 */
- (NSString*)nsStringFromString:(const std::string&)str {
    return [NSString stringWithUTF8String:str.c_str()];
}

/**
 * Helper to run on background queue
 */
- (void)runInBackground:(void (^)(void))block command:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        block();
    }];
}

/**
 * Helper to send success result
 */
- (void)sendSuccess:(NSString*)result forCommand:(CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                      messageAsString:result];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

/**
 * Helper to send error result
 */
- (void)sendError:(NSString*)error forCommand:(CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                      messageAsString:error];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - Initialization Functions

- (void)init:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSString* address = [command.arguments objectAtIndex:0];
            NSString* workingDir = [command.arguments objectAtIndex:1];
            NSNumber* logLevel = [command.arguments objectAtIndex:2];

            std::string result = plain_wallet::init(
                [self stringFromNSString:address],
                [self stringFromNSString:workingDir],
                [logLevel intValue]
            );

            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:[NSString stringWithFormat:@"Init failed: %@", e.reason] forCommand:command];
        }
    } command:command];
}

- (void)initWithIpPort:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSString* ip = [command.arguments objectAtIndex:0];
            NSString* port = [command.arguments objectAtIndex:1];
            NSString* workingDir = [command.arguments objectAtIndex:2];
            NSNumber* logLevel = [command.arguments objectAtIndex:3];

            std::string result = plain_wallet::init(
                [self stringFromNSString:ip],
                [self stringFromNSString:port],
                [self stringFromNSString:workingDir],
                [logLevel intValue]
            );

            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:[NSString stringWithFormat:@"Init failed: %@", e.reason] forCommand:command];
        }
    } command:command];
}

#pragma mark - Utility Functions

- (void)reset:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            std::string result = plain_wallet::reset();
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

- (void)setLogLevel:(CDVInvokedUrlCommand*)command {
    @try {
        NSNumber* logLevel = [command.arguments objectAtIndex:0];
        std::string result = plain_wallet::set_log_level([logLevel intValue]);
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getVersion:(CDVInvokedUrlCommand*)command {
    @try {
        std::string result = plain_wallet::get_version();
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getWalletFiles:(CDVInvokedUrlCommand*)command {
    @try {
        std::string result = plain_wallet::get_wallet_files();
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getExportPrivateInfo:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSString* targetDir = [command.arguments objectAtIndex:0];
            std::string result = plain_wallet::get_export_private_info([self stringFromNSString:targetDir]);
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

- (void)deleteWallet:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSString* fileName = [command.arguments objectAtIndex:0];
            std::string result = plain_wallet::delete_wallet([self stringFromNSString:fileName]);
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

- (void)getAddressInfo:(CDVInvokedUrlCommand*)command {
    @try {
        NSString* address = [command.arguments objectAtIndex:0];
        std::string result = plain_wallet::get_address_info([self stringFromNSString:address]);
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

#pragma mark - Configuration Functions

- (void)setAppConfig:(CDVInvokedUrlCommand*)command {
    @try {
        NSString* confStr = [command.arguments objectAtIndex:0];
        NSString* encryptionKey = [command.arguments objectAtIndex:1];
        std::string result = plain_wallet::set_appconfig(
            [self stringFromNSString:confStr],
            [self stringFromNSString:encryptionKey]
        );
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getAppConfig:(CDVInvokedUrlCommand*)command {
    @try {
        NSString* encryptionKey = [command.arguments objectAtIndex:0];
        std::string result = plain_wallet::get_appconfig([self stringFromNSString:encryptionKey]);
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)generateRandomKey:(CDVInvokedUrlCommand*)command {
    @try {
        NSNumber* length = [command.arguments objectAtIndex:0];
        std::string result = plain_wallet::generate_random_key([length unsignedLongLongValue]);
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getLogsBuffer:(CDVInvokedUrlCommand*)command {
    @try {
        std::string result = plain_wallet::get_logs_buffer();
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)truncateLog:(CDVInvokedUrlCommand*)command {
    @try {
        std::string result = plain_wallet::truncate_log();
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getConnectivityStatus:(CDVInvokedUrlCommand*)command {
    @try {
        std::string result = plain_wallet::get_connectivity_status();
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

#pragma mark - Wallet Management Functions

- (void)open:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSString* path = [command.arguments objectAtIndex:0];
            NSString* password = [command.arguments objectAtIndex:1];
            std::string result = plain_wallet::open(
                [self stringFromNSString:path],
                [self stringFromNSString:password]
            );
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

- (void)restore:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSString* seed = [command.arguments objectAtIndex:0];
            NSString* path = [command.arguments objectAtIndex:1];
            NSString* password = [command.arguments objectAtIndex:2];
            NSString* seedPassword = [command.arguments objectAtIndex:3];

            std::string result = plain_wallet::restore(
                [self stringFromNSString:seed],
                [self stringFromNSString:path],
                [self stringFromNSString:password],
                [self stringFromNSString:seedPassword]
            );
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

- (void)generate:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSString* path = [command.arguments objectAtIndex:0];
            NSString* password = [command.arguments objectAtIndex:1];

            std::string result = plain_wallet::generate(
                [self stringFromNSString:path],
                [self stringFromNSString:password]
            );
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

- (void)getOpenedWallets:(CDVInvokedUrlCommand*)command {
    @try {
        std::string result = plain_wallet::get_opened_wallets();
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

#pragma mark - Wallet Operations

- (void)getWalletStatus:(CDVInvokedUrlCommand*)command {
    @try {
        NSNumber* walletId = [command.arguments objectAtIndex:0];
        plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>([walletId longLongValue]);
        std::string result = plain_wallet::get_wallet_status(h);
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)closeWallet:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSNumber* walletId = [command.arguments objectAtIndex:0];
            plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>([walletId longLongValue]);
            std::string result = plain_wallet::close_wallet(h);
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

- (void)invoke:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSNumber* walletId = [command.arguments objectAtIndex:0];
            NSString* params = [command.arguments objectAtIndex:1];

            plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>([walletId longLongValue]);
            std::string result = plain_wallet::invoke(h, [self stringFromNSString:params]);
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

#pragma mark - Asynchronous API Functions

- (void)asyncCall:(CDVInvokedUrlCommand*)command {
    @try {
        NSString* methodName = [command.arguments objectAtIndex:0];
        NSNumber* walletId = [command.arguments objectAtIndex:1];
        NSString* params = [command.arguments objectAtIndex:2];

        std::string result = plain_wallet::async_call(
            [self stringFromNSString:methodName],
            [walletId unsignedLongLongValue],
            [self stringFromNSString:params]
        );
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)tryPullResult:(CDVInvokedUrlCommand*)command {
    @try {
        NSNumber* jobId = [command.arguments objectAtIndex:0];
        std::string result = plain_wallet::try_pull_result([jobId unsignedLongLongValue]);
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

#pragma mark - Cake Wallet API Extensions

- (void)isWalletExist:(CDVInvokedUrlCommand*)command {
    @try {
        NSString* path = [command.arguments objectAtIndex:0];
        bool result = plain_wallet::is_wallet_exist([self stringFromNSString:path]);

        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                          messageAsBool:result];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getWalletInfo:(CDVInvokedUrlCommand*)command {
    @try {
        NSNumber* walletId = [command.arguments objectAtIndex:0];
        plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>([walletId longLongValue]);
        std::string result = plain_wallet::get_wallet_info(h);
        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)resetWalletPassword:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSNumber* walletId = [command.arguments objectAtIndex:0];
            NSString* password = [command.arguments objectAtIndex:1];

            plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>([walletId longLongValue]);
            std::string result = plain_wallet::reset_wallet_password(h, [self stringFromNSString:password]);
            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:e.reason forCommand:command];
        }
    } command:command];
}

- (void)getCurrentTxFee:(CDVInvokedUrlCommand*)command {
    @try {
        NSNumber* priority = [command.arguments objectAtIndex:0];
        uint64_t result = plain_wallet::get_current_tx_fee([priority unsignedLongLongValue]);

        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                          messageAsNSInteger:result];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

#pragma mark - New Utility Functions

- (void)getWorkingDirectory:(CDVInvokedUrlCommand*)command {
    @try {
        // Get the iOS Documents directory path
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];

        [self sendSuccess:documentsDirectory forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getDownloadsDirectory:(CDVInvokedUrlCommand*)command {
    @try {
        // On iOS, there's no public Downloads directory like Android
        // We'll use the Documents directory as the download location
        // Alternatively, could use a "Downloads" subdirectory within Documents
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        NSString *downloadsDirectory = [documentsDirectory stringByAppendingPathComponent:@"Downloads"];

        // Create the Downloads directory if it doesn't exist
        NSFileManager *fileManager = [NSFileManager defaultManager];
        if (![fileManager fileExistsAtPath:downloadsDirectory]) {
            [fileManager createDirectoryAtPath:downloadsDirectory
                   withIntermediateDirectories:YES
                                    attributes:nil
                                         error:nil];
        }

        [self sendSuccess:downloadsDirectory forCommand:command];
    } @catch (NSException* e) {
        [self sendError:e.reason forCommand:command];
    }
}

- (void)getSeedPhraseInfo:(CDVInvokedUrlCommand*)command {
    @try {
        NSString* seed = [command.arguments objectAtIndex:0];
        NSString* seedPassword = [command.arguments objectAtIndex:1];

        // Build JSON params
        std::string seedStr = [self stringFromNSString:seed];
        std::string seedPassStr = [self stringFromNSString:seedPassword];
        std::string params = "{\"seed_phrase\":\"" + seedStr + "\",\"seed_password\":\"" + seedPassStr + "\"}";

        // Call via sync_call with instance_id 0 (controller-level call)
        std::string result = plain_wallet::sync_call("get_seed_phrase_info", 0, params);

        [self sendSuccess:[self nsStringFromString:result] forCommand:command];
    } @catch (NSException* e) {
        [self sendError:[NSString stringWithFormat:@"getSeedPhraseInfo failed: %@", e.reason] forCommand:command];
    }
}

- (void)daemonCall:(CDVInvokedUrlCommand*)command {
    [self runInBackground:^{
        @try {
            NSString* method = [command.arguments objectAtIndex:0];
            NSString* params = [command.arguments objectAtIndex:1];

            NSLog(@"Daemon RPC call: method=%@", method);

            // Build the JSON-RPC request
            std::string methodStr = [self stringFromNSString:method];
            std::string paramsStr = [self stringFromNSString:params];

            std::string rpc_request = "{\"jsonrpc\":\"2.0\",\"id\":0,\"method\":\"" + methodStr + "\",\"params\":" + paramsStr + "}";

            // Call plain_wallet::sync_call to proxy to daemon
            // For daemon calls, wallet_id is 0
            std::string result = plain_wallet::sync_call("proxy_to_daemon", 0, rpc_request);

            [self sendSuccess:[self nsStringFromString:result] forCommand:command];
        } @catch (NSException* e) {
            [self sendError:[NSString stringWithFormat:@"daemonCall failed: %@", e.reason] forCommand:command];
        }
    } command:command];
}

@end
