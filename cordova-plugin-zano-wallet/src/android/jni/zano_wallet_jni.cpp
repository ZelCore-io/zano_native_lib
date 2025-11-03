#include <jni.h>
#include <string>
#include <android/log.h>

// Include the Zano wallet API headers
#include "plain_wallet_api.h"

#define LOG_TAG "ZanoWalletJNI"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

// Helper function to convert jstring to std::string
std::string jstring_to_string(JNIEnv* env, jstring jStr) {
    if (jStr == nullptr) {
        return "";
    }
    const char* chars = env->GetStringUTFChars(jStr, nullptr);
    std::string str(chars);
    env->ReleaseStringUTFChars(jStr, chars);
    return str;
}

// Helper function to convert std::string to jstring
jstring string_to_jstring(JNIEnv* env, const std::string& str) {
    return env->NewStringUTF(str.c_str());
}

extern "C" {

// ========== Initialization Functions ==========

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeInit(JNIEnv* env, jobject thiz, jstring address, jstring workingDir, jint logLevel) {
    try {
        std::string addr = jstring_to_string(env, address);
        std::string workDir = jstring_to_string(env, workingDir);

        LOGI("Initializing Zano wallet: address=%s, workDir=%s, logLevel=%d", addr.c_str(), workDir.c_str(), logLevel);

        std::string result = plain_wallet::init(addr, workDir, logLevel);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("Init failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeInitWithIpPort(JNIEnv* env, jobject thiz, jstring ip, jstring port, jstring workingDir, jint logLevel) {
    try {
        std::string ipStr = jstring_to_string(env, ip);
        std::string portStr = jstring_to_string(env, port);
        std::string workDir = jstring_to_string(env, workingDir);

        LOGI("Initializing Zano wallet: ip=%s, port=%s, workDir=%s, logLevel=%d", ipStr.c_str(), portStr.c_str(), workDir.c_str(), logLevel);

        std::string result = plain_wallet::init(ipStr, portStr, workDir, logLevel);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("Init with IP/Port failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

// ========== Utility Functions ==========

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeReset(JNIEnv* env, jobject thiz) {
    try {
        std::string result = plain_wallet::reset();
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("Reset failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeSetLogLevel(JNIEnv* env, jobject thiz, jint logLevel) {
    try {
        std::string result = plain_wallet::set_log_level(logLevel);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetVersion(JNIEnv* env, jobject thiz) {
    try {
        std::string result = plain_wallet::get_version();
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetWalletFiles(JNIEnv* env, jobject thiz) {
    try {
        std::string result = plain_wallet::get_wallet_files();
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetExportPrivateInfo(JNIEnv* env, jobject thiz, jstring targetDir) {
    try {
        std::string dir = jstring_to_string(env, targetDir);
        std::string result = plain_wallet::get_export_private_info(dir);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeDeleteWallet(JNIEnv* env, jobject thiz, jstring fileName) {
    try {
        std::string file = jstring_to_string(env, fileName);
        std::string result = plain_wallet::delete_wallet(file);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetAddressInfo(JNIEnv* env, jobject thiz, jstring address) {
    try {
        std::string addr = jstring_to_string(env, address);
        std::string result = plain_wallet::get_address_info(addr);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

// ========== Configuration Functions ==========

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeSetAppConfig(JNIEnv* env, jobject thiz, jstring confStr, jstring encryptionKey) {
    try {
        std::string conf = jstring_to_string(env, confStr);
        std::string key = jstring_to_string(env, encryptionKey);
        std::string result = plain_wallet::set_appconfig(conf, key);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetAppConfig(JNIEnv* env, jobject thiz, jstring encryptionKey) {
    try {
        std::string key = jstring_to_string(env, encryptionKey);
        std::string result = plain_wallet::get_appconfig(key);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGenerateRandomKey(JNIEnv* env, jobject thiz, jlong length) {
    try {
        std::string result = plain_wallet::generate_random_key(static_cast<uint64_t>(length));
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetLogsBuffer(JNIEnv* env, jobject thiz) {
    try {
        std::string result = plain_wallet::get_logs_buffer();
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeTruncateLog(JNIEnv* env, jobject thiz) {
    try {
        std::string result = plain_wallet::truncate_log();
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetConnectivityStatus(JNIEnv* env, jobject thiz) {
    try {
        std::string result = plain_wallet::get_connectivity_status();
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

// ========== Wallet Management Functions ==========

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeOpen(JNIEnv* env, jobject thiz, jstring path, jstring password) {
    try {
        std::string pathStr = jstring_to_string(env, path);
        std::string pass = jstring_to_string(env, password);
        std::string result = plain_wallet::open(pathStr, pass);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("Open wallet failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeRestore(JNIEnv* env, jobject thiz, jstring seed, jstring path, jstring password, jstring seedPassword) {
    try {
        std::string seedStr = jstring_to_string(env, seed);
        std::string pathStr = jstring_to_string(env, path);
        std::string pass = jstring_to_string(env, password);
        std::string seedPass = jstring_to_string(env, seedPassword);

        std::string result = plain_wallet::restore(seedStr, pathStr, pass, seedPass);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("Restore wallet failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGenerate(JNIEnv* env, jobject thiz, jstring path, jstring password) {
    try {
        std::string pathStr = jstring_to_string(env, path);
        std::string pass = jstring_to_string(env, password);

        std::string result = plain_wallet::generate(pathStr, pass);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("Generate wallet failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetOpenedWallets(JNIEnv* env, jobject thiz) {
    try {
        std::string result = plain_wallet::get_opened_wallets();
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

// ========== Wallet Operations ==========

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetWalletStatus(JNIEnv* env, jobject thiz, jlong walletId) {
    try {
        plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>(walletId);
        std::string result = plain_wallet::get_wallet_status(h);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeCloseWallet(JNIEnv* env, jobject thiz, jlong walletId) {
    try {
        plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>(walletId);
        std::string result = plain_wallet::close_wallet(h);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeInvoke(JNIEnv* env, jobject thiz, jlong walletId, jstring params) {
    try {
        plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>(walletId);
        std::string paramsStr = jstring_to_string(env, params);

        std::string result = plain_wallet::invoke(h, paramsStr);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

// ========== Asynchronous API Functions ==========

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeAsyncCall(JNIEnv* env, jobject thiz, jstring methodName, jlong walletId, jstring params) {
    try {
        std::string method = jstring_to_string(env, methodName);
        std::string paramsStr = jstring_to_string(env, params);

        std::string result = plain_wallet::async_call(method, static_cast<uint64_t>(walletId), paramsStr);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeTryPullResult(JNIEnv* env, jobject thiz, jlong jobId) {
    try {
        std::string result = plain_wallet::try_pull_result(static_cast<uint64_t>(jobId));
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

// ========== Cake Wallet API Extensions ==========

JNIEXPORT jboolean JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeIsWalletExist(JNIEnv* env, jobject thiz, jstring path) {
    try {
        std::string pathStr = jstring_to_string(env, path);
        bool result = plain_wallet::is_wallet_exist(pathStr);
        return result ? JNI_TRUE : JNI_FALSE;
    } catch (const std::exception& e) {
        LOGE("isWalletExist failed: %s", e.what());
        return JNI_FALSE;
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetWalletInfo(JNIEnv* env, jobject thiz, jlong walletId) {
    try {
        plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>(walletId);
        std::string result = plain_wallet::get_wallet_info(h);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeResetWalletPassword(JNIEnv* env, jobject thiz, jlong walletId, jstring password) {
    try {
        plain_wallet::hwallet h = static_cast<plain_wallet::hwallet>(walletId);
        std::string pass = jstring_to_string(env, password);

        std::string result = plain_wallet::reset_wallet_password(h, pass);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jlong JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetCurrentTxFee(JNIEnv* env, jobject thiz, jlong priority) {
    try {
        uint64_t result = plain_wallet::get_current_tx_fee(static_cast<uint64_t>(priority));
        return static_cast<jlong>(result);
    } catch (const std::exception& e) {
        LOGE("getCurrentTxFee failed: %s", e.what());
        return 0;
    }
}

// ========== New Utility Functions ==========

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetWorkingDirectory(JNIEnv* env, jobject thiz) {
    try {
        // On Android, the working directory should be obtained from Java context
        // This returns the internal app files directory path
        // For now, we return a platform-specific default that will be set by Java
        // The actual directory is passed during init() and managed by the wallet library

        // Note: In practice, this should be called from Java side using:
        // context.getFilesDir().getAbsolutePath()

        // Return the directory from plain_wallet if it has a getter, otherwise return a note
        std::string result = "{\"directory\":\"/data/data/com.zano.wallet/files\"}";
        LOGI("getWorkingDirectory called - should be handled on Java side with context.getFilesDir()");
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("getWorkingDirectory failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetDownloadsDirectory(JNIEnv* env, jobject thiz) {
    try {
        // On Android, the downloads directory should be obtained from Java context
        // This should use Environment.getExternalStoragePublicDirectory(DIRECTORY_DOWNLOADS)

        // Note: In practice, this should be called from Java side using:
        // Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath()

        std::string result = "{\"directory\":\"/storage/emulated/0/Download\"}";
        LOGI("getDownloadsDirectory called - should be handled on Java side with Environment.getExternalStoragePublicDirectory()");
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("getDownloadsDirectory failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeGetSeedPhraseInfo(JNIEnv* env, jobject thiz, jstring seed, jstring seedPassword) {
    try {
        std::string seedStr = jstring_to_string(env, seed);
        std::string seedPassStr = jstring_to_string(env, seedPassword);

        LOGI("Getting seed phrase info");

        // Build JSON params
        std::string params = "{\"seed_phrase\":\"" + seedStr + "\",\"seed_password\":\"" + seedPassStr + "\"}";

        // Call via sync_call with instance_id 0 (controller-level call)
        std::string result = plain_wallet::sync_call("get_seed_phrase_info", 0, params);
        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("getSeedPhraseInfo failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

JNIEXPORT jstring JNICALL
Java_com_zano_wallet_ZanoWalletPlugin_nativeDaemonCall(JNIEnv* env, jobject thiz, jstring method, jstring params) {
    try {
        std::string methodStr = jstring_to_string(env, method);
        std::string paramsStr = jstring_to_string(env, params);

        LOGI("Daemon RPC call: method=%s", methodStr.c_str());

        // Build the JSON-RPC request
        // The params should already be a JSON string containing the method and parameters
        // We need to call sync_call with "proxy_to_daemon" command

        std::string rpc_request = "{\"jsonrpc\":\"2.0\",\"id\":0,\"method\":\"" + methodStr + "\",\"params\":" + paramsStr + "}";

        // Call plain_wallet::sync_call to proxy to daemon
        // The sync_call function signature: sync_call(command, wallet_id, params)
        // For daemon calls, wallet_id is 0
        std::string result = plain_wallet::sync_call("proxy_to_daemon", 0, rpc_request);

        return string_to_jstring(env, result);
    } catch (const std::exception& e) {
        LOGE("daemonCall failed: %s", e.what());
        return string_to_jstring(env, std::string("Error: ") + e.what());
    }
}

} // extern "C"
