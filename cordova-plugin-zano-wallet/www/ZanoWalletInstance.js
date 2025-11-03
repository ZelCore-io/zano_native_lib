"use strict";
/**
 * ZanoWalletInstance - High-level wallet instance API
 * Wraps a wallet_id and provides typed methods for all wallet operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZanoWalletInstance = void 0;
const ZanoWalletPlugin_1 = require("./ZanoWalletPlugin");
class ZanoWalletInstance {
    constructor(response) {
        this.wallet_id = response.wallet_id;
        this.name = response.name;
        this.wi = response.wi;
        this.seed = response.seed;
        this.recovered = response.recovered;
    }
    /**
     * Internal method to invoke wallet RPC methods
     */
    async _invoke(method, params = {}) {
        const response = await ZanoWalletPlugin_1.ZanoWalletPlugin.invoke(this.wallet_id, {
            method,
            params,
        });
        if (response.error) {
            throw new Error(`Wallet RPC Error: ${response.error.message}`);
        }
        return response.result;
    }
    // ========== Core Wallet Methods ==========
    /**
     * Get wallet status
     */
    async getStatus() {
        return ZanoWalletPlugin_1.ZanoWalletPlugin.getWalletStatus(this.wallet_id);
    }
    /**
     * Update wallet info
     */
    async updateWalletInfo() {
        const info = await ZanoWalletPlugin_1.ZanoWalletPlugin.getWalletInfo(this.wallet_id);
        this.wi = info;
        return info;
    }
    /**
     * Close wallet
     */
    async close() {
        await ZanoWalletPlugin_1.ZanoWalletPlugin.closeWallet(this.wallet_id);
    }
    /**
     * Reset wallet password
     */
    async resetPassword(newPassword) {
        await ZanoWalletPlugin_1.ZanoWalletPlugin.resetWalletPassword(this.wallet_id, newPassword);
    }
    /**
     * Store wallet to disk
     */
    async store() {
        return this._invoke('store', {});
    }
    // ========== Balance & Address Methods ==========
    /**
     * Get wallet balances
     */
    async getbalance(params = {}) {
        return this._invoke('getbalance', params);
    }
    /**
     * Get wallet address
     */
    async getaddress(params = {}) {
        return this._invoke('getaddress', params);
    }
    /**
     * Get extended wallet info
     */
    async get_wallet_info(params = {}) {
        return this._invoke('get_wallet_info', params);
    }
    // ========== Transaction History Methods ==========
    /**
     * Get recent transactions and info
     */
    async get_recent_txs_and_info(params) {
        return this._invoke('get_recent_txs_and_info', params);
    }
    /**
     * Get recent transactions and info (v2)
     */
    async get_recent_txs_and_info2(params) {
        return this._invoke('get_recent_txs_and_info2', params);
    }
    /**
     * Search for transactions
     */
    async search_for_transactions(params) {
        return this._invoke('search_for_transactions', params);
    }
    /**
     * Search for transactions (v2)
     */
    async search_for_transactions2(params) {
        return this._invoke('search_for_transactions2', params);
    }
    // ========== Transfer Methods ==========
    /**
     * Send a transaction
     */
    async transfer(params) {
        return this._invoke('transfer', params);
    }
    /**
     * Sign transfer (without broadcasting)
     */
    async sign_transfer(params) {
        return this._invoke('sign_transfer', params);
    }
    /**
     * Submit signed transfer
     */
    async submit_transfer(params) {
        return this._invoke('submit_transfer', params);
    }
    /**
     * Sweep outputs below threshold
     */
    async sweep_below(params) {
        return this._invoke('sweep_below', params);
    }
    /**
     * Get bare outputs statistics
     */
    async get_bare_outs_stats(params = {}) {
        return this._invoke('get_bare_outs_stats', params);
    }
    /**
     * Sweep bare outputs
     */
    async sweep_bare_outs(params) {
        return this._invoke('sweep_bare_outs', params);
    }
    // ========== Payment Methods ==========
    /**
     * Get payments by payment ID
     */
    async get_payments(params) {
        return this._invoke('get_payments', params);
    }
    /**
     * Get bulk payments
     */
    async get_bulk_payments(params) {
        return this._invoke('get_bulk_payments', params);
    }
    // ========== Address Methods ==========
    /**
     * Create integrated address
     */
    async make_integrated_address(params) {
        return this._invoke('make_integrated_address', params);
    }
    /**
     * Split integrated address
     */
    async split_integrated_address(params) {
        return this._invoke('split_integrated_address', params);
    }
    // ========== Alias Methods ==========
    /**
     * Register alias
     */
    async register_alias(params) {
        return this._invoke('register_alias', params);
    }
    /**
     * Update alias
     */
    async update_alias(params) {
        return this._invoke('update_alias', params);
    }
    // ========== Asset Methods ==========
    /**
     * Get asset whitelist
     */
    async assets_whitelist_get(params = {}) {
        return this._invoke('assets_whitelist_get', params);
    }
    /**
     * Add asset to whitelist
     */
    async assets_whitelist_add(params) {
        return this._invoke('assets_whitelist_add', params);
    }
    /**
     * Remove asset from whitelist
     */
    async assets_whitelist_remove(params) {
        return this._invoke('assets_whitelist_remove', params);
    }
    /**
     * Deploy new asset
     */
    async deploy_asset(params) {
        return this._invoke('deploy_asset', params);
    }
    /**
     * Emit asset
     */
    async emit_asset(params) {
        return this._invoke('emit_asset', params);
    }
    /**
     * Update asset
     */
    async update_asset(params) {
        return this._invoke('update_asset', params);
    }
    /**
     * Burn asset
     */
    async burn_asset(params) {
        return this._invoke('burn_asset', params);
    }
    /**
     * Attach asset descriptor
     */
    async attach_asset_descriptor(params) {
        return this._invoke('attach_asset_descriptor', params);
    }
    /**
     * Transfer asset ownership
     */
    async transfer_asset_ownership(params) {
        return this._invoke('transfer_asset_ownership', params);
    }
    /**
     * Send externally signed asset transaction
     */
    async send_ext_signed_asset_tx(params) {
        return this._invoke('send_ext_signed_asset_tx', params);
    }
    // ========== Marketplace Methods ==========
    /**
     * Get marketplace offers
     */
    async marketplace_get_offers_ex(params) {
        return this._invoke('marketplace_get_offers_ex', params);
    }
    /**
     * Push marketplace offer
     */
    async marketplace_push_offer(params) {
        return this._invoke('marketplace_push_offer', params);
    }
    /**
     * Update marketplace offer
     */
    async marketplace_push_update_offer(params) {
        return this._invoke('marketplace_push_update_offer', params);
    }
    /**
     * Cancel marketplace offer
     */
    async marketplace_cancel_offer(params) {
        return this._invoke('marketplace_cancel_offer', params);
    }
    // ========== Ionic Swap Methods ==========
    /**
     * Generate ionic swap proposal
     */
    async ionic_swap_generate_proposal(params) {
        return this._invoke('ionic_swap_generate_proposal', params);
    }
    /**
     * Get ionic swap proposal info
     */
    async ionic_swap_get_proposal_info(params) {
        return this._invoke('ionic_swap_get_proposal_info', params);
    }
    /**
     * Accept ionic swap proposal
     */
    async ionic_swap_accept_proposal(params) {
        return this._invoke('ionic_swap_accept_proposal', params);
    }
    // ========== Multiwallet Methods ==========
    /**
     * Get all wallets
     */
    async mw_get_wallets(params = {}) {
        return this._invoke('mw_get_wallets', params);
    }
    /**
     * Select wallet
     */
    async mw_select_wallet(params) {
        return this._invoke('mw_select_wallet', params);
    }
    // ========== Cryptography Methods ==========
    /**
     * Sign message
     */
    async sign_message(params) {
        return this._invoke('sign_message', params);
    }
    /**
     * Encrypt data
     */
    async encrypt_data(params) {
        return this._invoke('encrypt_data', params);
    }
    /**
     * Decrypt data
     */
    async decrypt_data(params) {
        return this._invoke('decrypt_data', params);
    }
    // ========== Mining Methods ==========
    /**
     * Get mining history
     */
    async get_mining_history(params = {}) {
        return this._invoke('get_mining_history', params);
    }
    // ========== Restore Methods ==========
    /**
     * Get restore info
     */
    async get_restore_info(params = {}) {
        return this._invoke('get_restore_info', params);
    }
}
exports.ZanoWalletInstance = ZanoWalletInstance;
//# sourceMappingURL=ZanoWalletInstance.js.map