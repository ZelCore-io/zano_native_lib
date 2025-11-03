"use strict";
/**
 * Cordova Plugin for Zano Wallet
 * Main exports
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncCallAndWait = exports.pollAsyncResult = exports.ZanoWalletPlugin = exports.ZanoWalletInstance = exports.ZanoAppConfig = exports.ZanoWalletFile = exports.ZanoController = void 0;
var ZanoController_1 = require("./ZanoController");
Object.defineProperty(exports, "ZanoController", { enumerable: true, get: function () { return ZanoController_1.ZanoController; } });
Object.defineProperty(exports, "ZanoWalletFile", { enumerable: true, get: function () { return ZanoController_1.ZanoWalletFile; } });
Object.defineProperty(exports, "ZanoAppConfig", { enumerable: true, get: function () { return ZanoController_1.ZanoAppConfig; } });
var ZanoWalletInstance_1 = require("./ZanoWalletInstance");
Object.defineProperty(exports, "ZanoWalletInstance", { enumerable: true, get: function () { return ZanoWalletInstance_1.ZanoWalletInstance; } });
var ZanoWalletPlugin_1 = require("./ZanoWalletPlugin");
Object.defineProperty(exports, "ZanoWalletPlugin", { enumerable: true, get: function () { return ZanoWalletPlugin_1.ZanoWalletPlugin; } });
Object.defineProperty(exports, "pollAsyncResult", { enumerable: true, get: function () { return ZanoWalletPlugin_1.pollAsyncResult; } });
Object.defineProperty(exports, "asyncCallAndWait", { enumerable: true, get: function () { return ZanoWalletPlugin_1.asyncCallAndWait; } });
// Export all types
__exportStar(require("./entities"), exports);
// Default export for CommonJS compatibility
const ZanoController_2 = require("./ZanoController");
exports.default = ZanoController_2.ZanoController;
//# sourceMappingURL=index.js.map