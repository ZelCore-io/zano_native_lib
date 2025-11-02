package com.zano.wallet;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Cordova plugin bridge for Zano Wallet native library
 */
public class ZanoWalletPlugin extends CordovaPlugin {
    private static final String TAG = "ZanoWalletPlugin";

    // Thread pool for background operations
    private ExecutorService executorService;

    // Native library name
    static {
        try {
            System.loadLibrary("zanowallet_jni");
            Log.d(TAG, "Native library loaded successfully");
        } catch (UnsatisfiedLinkError e) {
            Log.e(TAG, "Failed to load native library: " + e.getMessage());
        }
    }

    @Override
    public void initialize(org.apache.cordova.CordovaInterface cordova, org.apache.cordova.CordovaWebView webView) {
        super.initialize(cordova, webView);
        executorService = Executors.newCachedThreadPool();
        Log.d(TAG, "ZanoWalletPlugin initialized");
    }

    @Override
    public void onDestroy() {
        if (executorService != null) {
            executorService.shutdown();
        }
        super.onDestroy();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        try {
            switch (action) {
                // Initialization
                case "init":
                    this.init(args.getString(0), args.getString(1), args.getInt(2), callbackContext);
                    return true;
                case "initWithIpPort":
                    this.initWithIpPort(args.getString(0), args.getString(1), args.getString(2), args.getInt(3), callbackContext);
                    return true;

                // Utility functions
                case "reset":
                    this.reset(callbackContext);
                    return true;
                case "setLogLevel":
                    this.setLogLevel(args.getInt(0), callbackContext);
                    return true;
                case "getVersion":
                    this.getVersion(callbackContext);
                    return true;
                case "getWalletFiles":
                    this.getWalletFiles(callbackContext);
                    return true;
                case "getExportPrivateInfo":
                    this.getExportPrivateInfo(args.getString(0), callbackContext);
                    return true;
                case "deleteWallet":
                    this.deleteWallet(args.getString(0), callbackContext);
                    return true;
                case "getAddressInfo":
                    this.getAddressInfo(args.getString(0), callbackContext);
                    return true;

                // Configuration
                case "setAppConfig":
                    this.setAppConfig(args.getString(0), args.getString(1), callbackContext);
                    return true;
                case "getAppConfig":
                    this.getAppConfig(args.getString(0), callbackContext);
                    return true;
                case "generateRandomKey":
                    this.generateRandomKey(args.getLong(0), callbackContext);
                    return true;
                case "getLogsBuffer":
                    this.getLogsBuffer(callbackContext);
                    return true;
                case "truncateLog":
                    this.truncateLog(callbackContext);
                    return true;
                case "getConnectivityStatus":
                    this.getConnectivityStatus(callbackContext);
                    return true;

                // Wallet management
                case "open":
                    this.open(args.getString(0), args.getString(1), callbackContext);
                    return true;
                case "restore":
                    this.restore(args.getString(0), args.getString(1), args.getString(2), args.getString(3), callbackContext);
                    return true;
                case "generate":
                    this.generate(args.getString(0), args.getString(1), callbackContext);
                    return true;
                case "getOpenedWallets":
                    this.getOpenedWallets(callbackContext);
                    return true;

                // Wallet operations
                case "getWalletStatus":
                    this.getWalletStatus(args.getLong(0), callbackContext);
                    return true;
                case "closeWallet":
                    this.closeWallet(args.getLong(0), callbackContext);
                    return true;
                case "invoke":
                    this.invoke(args.getLong(0), args.getString(1), callbackContext);
                    return true;

                // Async operations
                case "asyncCall":
                    this.asyncCall(args.getString(0), args.getLong(1), args.getString(2), callbackContext);
                    return true;
                case "tryPullResult":
                    this.tryPullResult(args.getLong(0), callbackContext);
                    return true;

                // Cake Wallet extensions
                case "isWalletExist":
                    this.isWalletExist(args.getString(0), callbackContext);
                    return true;
                case "getWalletInfo":
                    this.getWalletInfo(args.getLong(0), callbackContext);
                    return true;
                case "resetWalletPassword":
                    this.resetWalletPassword(args.getLong(0), args.getString(1), callbackContext);
                    return true;
                case "getCurrentTxFee":
                    this.getCurrentTxFee(args.getLong(0), callbackContext);
                    return true;

                default:
                    return false;
            }
        } catch (Exception e) {
            Log.e(TAG, "Error executing action: " + action, e);
            callbackContext.error("Error: " + e.getMessage());
            return false;
        }
    }

    // Helper to run on background thread
    private void runOnBackground(final Runnable task) {
        executorService.execute(task);
    }

    // ========== Native method declarations ==========

    // Initialization
    private native String nativeInit(String address, String workingDir, int logLevel);
    private native String nativeInitWithIpPort(String ip, String port, String workingDir, int logLevel);

    // Utility
    private native String nativeReset();
    private native String nativeSetLogLevel(int logLevel);
    private native String nativeGetVersion();
    private native String nativeGetWalletFiles();
    private native String nativeGetExportPrivateInfo(String targetDir);
    private native String nativeDeleteWallet(String fileName);
    private native String nativeGetAddressInfo(String address);

    // Configuration
    private native String nativeSetAppConfig(String confStr, String encryptionKey);
    private native String nativeGetAppConfig(String encryptionKey);
    private native String nativeGenerateRandomKey(long length);
    private native String nativeGetLogsBuffer();
    private native String nativeTruncateLog();
    private native String nativeGetConnectivityStatus();

    // Wallet management
    private native String nativeOpen(String path, String password);
    private native String nativeRestore(String seed, String path, String password, String seedPassword);
    private native String nativeGenerate(String path, String password);
    private native String nativeGetOpenedWallets();

    // Wallet operations
    private native String nativeGetWalletStatus(long walletId);
    private native String nativeCloseWallet(long walletId);
    private native String nativeInvoke(long walletId, String params);

    // Async
    private native String nativeAsyncCall(String methodName, long walletId, String params);
    private native String nativeTryPullResult(long jobId);

    // Cake Wallet
    private native boolean nativeIsWalletExist(String path);
    private native String nativeGetWalletInfo(long walletId);
    private native String nativeResetWalletPassword(long walletId, String password);
    private native long nativeGetCurrentTxFee(long priority);

    // ========== Implementation methods ==========

    private void init(final String address, final String workingDir, final int logLevel, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeInit(address, workingDir, logLevel);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error("Init failed: " + e.getMessage());
                }
            }
        });
    }

    private void initWithIpPort(final String ip, final String port, final String workingDir, final int logLevel, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeInitWithIpPort(ip, port, workingDir, logLevel);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error("Init failed: " + e.getMessage());
                }
            }
        });
    }

    private void reset(final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeReset();
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void setLogLevel(final int logLevel, final CallbackContext callbackContext) {
        try {
            String result = nativeSetLogLevel(logLevel);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getVersion(final CallbackContext callbackContext) {
        try {
            String result = nativeGetVersion();
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getWalletFiles(final CallbackContext callbackContext) {
        try {
            String result = nativeGetWalletFiles();
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getExportPrivateInfo(final String targetDir, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeGetExportPrivateInfo(targetDir);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void deleteWallet(final String fileName, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeDeleteWallet(fileName);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void getAddressInfo(final String address, final CallbackContext callbackContext) {
        try {
            String result = nativeGetAddressInfo(address);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void setAppConfig(final String confStr, final String encryptionKey, final CallbackContext callbackContext) {
        try {
            String result = nativeSetAppConfig(confStr, encryptionKey);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getAppConfig(final String encryptionKey, final CallbackContext callbackContext) {
        try {
            String result = nativeGetAppConfig(encryptionKey);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void generateRandomKey(final long length, final CallbackContext callbackContext) {
        try {
            String result = nativeGenerateRandomKey(length);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getLogsBuffer(final CallbackContext callbackContext) {
        try {
            String result = nativeGetLogsBuffer();
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void truncateLog(final CallbackContext callbackContext) {
        try {
            String result = nativeTruncateLog();
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getConnectivityStatus(final CallbackContext callbackContext) {
        try {
            String result = nativeGetConnectivityStatus();
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void open(final String path, final String password, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeOpen(path, password);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void restore(final String seed, final String path, final String password, final String seedPassword, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeRestore(seed, path, password, seedPassword);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void generate(final String path, final String password, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeGenerate(path, password);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void getOpenedWallets(final CallbackContext callbackContext) {
        try {
            String result = nativeGetOpenedWallets();
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getWalletStatus(final long walletId, final CallbackContext callbackContext) {
        try {
            String result = nativeGetWalletStatus(walletId);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void closeWallet(final long walletId, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeCloseWallet(walletId);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void invoke(final long walletId, final String params, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeInvoke(walletId, params);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void asyncCall(final String methodName, final long walletId, final String params, final CallbackContext callbackContext) {
        try {
            String result = nativeAsyncCall(methodName, walletId, params);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void tryPullResult(final long jobId, final CallbackContext callbackContext) {
        try {
            String result = nativeTryPullResult(jobId);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void isWalletExist(final String path, final CallbackContext callbackContext) {
        try {
            boolean result = nativeIsWalletExist(path);
            callbackContext.success(result ? 1 : 0);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getWalletInfo(final long walletId, final CallbackContext callbackContext) {
        try {
            String result = nativeGetWalletInfo(walletId);
            callbackContext.success(result);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void resetWalletPassword(final long walletId, final String password, final CallbackContext callbackContext) {
        runOnBackground(new Runnable() {
            @Override
            public void run() {
                try {
                    String result = nativeResetWalletPassword(walletId, password);
                    callbackContext.success(result);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void getCurrentTxFee(final long priority, final CallbackContext callbackContext) {
        try {
            long result = nativeGetCurrentTxFee(priority);
            callbackContext.success(String.valueOf(result));
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }
}
