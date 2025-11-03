"use strict";
/**
 * Entity type definitions for Zano Wallet
 * Based on plain_wallet_api_defs.h and wallet_public_structs_defs.h
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZanoPriority = exports.ZanoLogLevel = exports.RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS = exports.WALLET_RPC_ERROR_CODE = exports.API_RETURN_CODE = void 0;
// ========== API Response Types ==========
var API_RETURN_CODE;
(function (API_RETURN_CODE) {
    API_RETURN_CODE["OK"] = "OK";
    API_RETURN_CODE["FAIL"] = "FAIL";
    API_RETURN_CODE["NOT_FOUND"] = "NOT_FOUND";
    API_RETURN_CODE["ALREADY_EXISTS"] = "ALREADY_EXISTS";
    API_RETURN_CODE["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    API_RETURN_CODE["INVALID_FILE"] = "INVALID_FILE";
    API_RETURN_CODE["WRONG_PASSWORD"] = "WRONG_PASSWORD";
    API_RETURN_CODE["WRONG_SEED"] = "WRONG_SEED";
    API_RETURN_CODE["WALLET_WRONG_ID"] = "WALLET_WRONG_ID";
    API_RETURN_CODE["WALLET_WATCH_ONLY_NOT_SUPPORTED"] = "WALLET_WATCH_ONLY_NOT_SUPPORTED";
    API_RETURN_CODE["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
})(API_RETURN_CODE || (exports.API_RETURN_CODE = API_RETURN_CODE = {}));
var WALLET_RPC_ERROR_CODE;
(function (WALLET_RPC_ERROR_CODE) {
    WALLET_RPC_ERROR_CODE["WRONG_ADDRESS"] = "WRONG_ADDRESS";
    WALLET_RPC_ERROR_CODE["DAEMON_IS_BUSY"] = "DAEMON_IS_BUSY";
    WALLET_RPC_ERROR_CODE["GENERIC_TRANSFER_ERROR"] = "GENERIC_TRANSFER_ERROR";
    WALLET_RPC_ERROR_CODE["WRONG_PAYMENT_ID"] = "WRONG_PAYMENT_ID";
    WALLET_RPC_ERROR_CODE["NOT_ENOUGH_MONEY"] = "NOT_ENOUGH_MONEY";
    WALLET_RPC_ERROR_CODE["WRONG_ARGUMENT"] = "WRONG_ARGUMENT";
})(WALLET_RPC_ERROR_CODE || (exports.WALLET_RPC_ERROR_CODE = WALLET_RPC_ERROR_CODE = {}));
var RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS;
(function (RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS) {
    RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS[RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS["MINIMUM_ELIGBLE_HEIGHT"] = 1] = "MINIMUM_ELIGBLE_HEIGHT";
})(RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS || (exports.RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS = RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS = {}));
// ========== Enums ==========
var ZanoLogLevel;
(function (ZanoLogLevel) {
    ZanoLogLevel[ZanoLogLevel["DISABLED"] = -1] = "DISABLED";
    ZanoLogLevel[ZanoLogLevel["DEFAULT"] = 0] = "DEFAULT";
    ZanoLogLevel[ZanoLogLevel["TRACE"] = 1] = "TRACE";
    ZanoLogLevel[ZanoLogLevel["DEBUG"] = 2] = "DEBUG";
    ZanoLogLevel[ZanoLogLevel["INFO"] = 3] = "INFO";
    ZanoLogLevel[ZanoLogLevel["WARNING"] = 4] = "WARNING";
    ZanoLogLevel[ZanoLogLevel["ERROR"] = 5] = "ERROR";
    ZanoLogLevel[ZanoLogLevel["FATAL"] = 6] = "FATAL";
})(ZanoLogLevel || (exports.ZanoLogLevel = ZanoLogLevel = {}));
var ZanoPriority;
(function (ZanoPriority) {
    ZanoPriority[ZanoPriority["DEFAULT"] = 0] = "DEFAULT";
    ZanoPriority[ZanoPriority["LOW"] = 1] = "LOW";
    ZanoPriority[ZanoPriority["NORMAL"] = 2] = "NORMAL";
    ZanoPriority[ZanoPriority["HIGH"] = 3] = "HIGH";
})(ZanoPriority || (exports.ZanoPriority = ZanoPriority = {}));
//# sourceMappingURL=entities.js.map