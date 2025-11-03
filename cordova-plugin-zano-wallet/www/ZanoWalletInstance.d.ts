/**
 * ZanoWalletInstance - High-level wallet instance API
 * Wraps a wallet_id and provides typed methods for all wallet operations
 */
import type { open_wallet_response, WalletInfo, WalletStatus, asset_balance_entry, wallet_provision_info, wallet_transfer_info, transfer_destination, payment_details, asset_descriptor_base, asset_descriptor_with_id, data_for_external_asset_signing_tx, offer_details_ex, core_offers_filter, ionic_swap_proposal_info, wallet_entry_info, mining_history, restore_info, alias_rpc_details } from './entities';
export declare class ZanoWalletInstance {
    readonly wallet_id: number;
    readonly name: string;
    wi: WalletInfo;
    seed: string;
    recovered: boolean;
    constructor(response: open_wallet_response);
    /**
     * Internal method to invoke wallet RPC methods
     */
    private _invoke;
    /**
     * Get wallet status
     */
    getStatus(): Promise<WalletStatus>;
    /**
     * Update wallet info
     */
    updateWalletInfo(): Promise<WalletInfo>;
    /**
     * Close wallet
     */
    close(): Promise<void>;
    /**
     * Reset wallet password
     */
    resetPassword(newPassword: string): Promise<void>;
    /**
     * Store wallet to disk
     */
    store(): Promise<{
        wallet_file_size: number;
    }>;
    /**
     * Get wallet balances
     */
    getbalance(params?: {}): Promise<{
        balance: number;
        unlocked_balance: number;
        balances: asset_balance_entry[];
    }>;
    /**
     * Get wallet address
     */
    getaddress(params?: {}): Promise<{
        address: string;
    }>;
    /**
     * Get extended wallet info
     */
    get_wallet_info(params?: {}): Promise<{
        address: string;
        path: string;
        transfers_count: number;
        transfer_entries_count: number;
        is_watch_only: boolean;
        has_bare_unspent_outputs: boolean;
        current_height: number;
    }>;
    /**
     * Get recent transactions and info
     */
    get_recent_txs_and_info(params: {
        offset?: number;
        count?: number;
        update_provision_info?: boolean;
        exclude_mining_txs?: boolean;
        exclude_unconfirmed?: boolean;
        order?: 'FROM_BEGIN_TO_END' | 'FROM_END_TO_BEGIN';
    }): Promise<{
        pi: wallet_provision_info;
        transfers: wallet_transfer_info[];
        total_transfers: number;
        last_item_index: number;
    }>;
    /**
     * Get recent transactions and info (v2)
     */
    get_recent_txs_and_info2(params: {
        offset: number;
        count: number;
        update_provision_info: boolean;
        exclude_mining_txs: boolean;
        exclude_unconfirmed: boolean;
        order: 'FROM_BEGIN_TO_END' | 'FROM_END_TO_BEGIN';
    }): Promise<{
        pi: wallet_provision_info;
        transfers: wallet_transfer_info[];
        total_transfers: number;
        last_item_index: number;
    }>;
    /**
     * Search for transactions
     */
    search_for_transactions(params: {
        tx_id?: string;
        filter_by_height?: boolean;
        min_height?: number;
        max_height?: number;
        in?: boolean;
        out?: boolean;
        pending?: boolean;
        failed?: boolean;
        pool?: boolean;
    }): Promise<{
        transfers: wallet_transfer_info[];
    }>;
    /**
     * Search for transactions (v2)
     */
    search_for_transactions2(params: any): Promise<any>;
    /**
     * Send a transaction
     */
    transfer(params: {
        destinations: transfer_destination[];
        fee: number;
        mixin?: number;
        payment_id?: string;
        comment?: string;
        push_payer?: boolean;
        hide_receiver?: boolean;
        service_entries_permanent?: boolean;
    }): Promise<{
        tx_hash: string;
        tx_unsigned_hex?: string;
    }>;
    /**
     * Sign transfer (without broadcasting)
     */
    sign_transfer(params: any): Promise<{
        tx_unsigned_hex: string;
    }>;
    /**
     * Submit signed transfer
     */
    submit_transfer(params: {
        tx_unsigned_hex: string;
    }): Promise<{
        tx_hash: string;
    }>;
    /**
     * Sweep outputs below threshold
     */
    sweep_below(params: {
        address: string;
        amount: number;
        fee: number;
        mixin: number;
    }): Promise<{
        tx_hash: string;
    }>;
    /**
     * Get bare outputs statistics
     */
    get_bare_outs_stats(params?: {}): Promise<any>;
    /**
     * Sweep bare outputs
     */
    sweep_bare_outs(params: any): Promise<{
        tx_hash: string;
    }>;
    /**
     * Get payments by payment ID
     */
    get_payments(params: {
        payment_id: string;
    }): Promise<{
        payments: payment_details[];
    }>;
    /**
     * Get bulk payments
     */
    get_bulk_payments(params: {
        payment_ids: string[];
        min_block_height?: number;
    }): Promise<{
        payments: payment_details[];
    }>;
    /**
     * Create integrated address
     */
    make_integrated_address(params: {
        payment_id?: string;
    }): Promise<{
        integrated_address: string;
        payment_id: string;
    }>;
    /**
     * Split integrated address
     */
    split_integrated_address(params: {
        integrated_address: string;
    }): Promise<{
        address: string;
        payment_id: string;
    }>;
    /**
     * Register alias
     */
    register_alias(params: {
        alias: string;
        address?: string;
        comment?: string;
    }): Promise<{
        tx_hash: string;
    }>;
    /**
     * Update alias
     */
    update_alias(params: alias_rpc_details): Promise<{
        tx_hash: string;
    }>;
    /**
     * Get asset whitelist
     */
    assets_whitelist_get(params?: {}): Promise<{
        assets: asset_descriptor_with_id[];
    }>;
    /**
     * Add asset to whitelist
     */
    assets_whitelist_add(params: {
        asset_id: string;
    }): Promise<void>;
    /**
     * Remove asset from whitelist
     */
    assets_whitelist_remove(params: {
        asset_id: string;
    }): Promise<void>;
    /**
     * Deploy new asset
     */
    deploy_asset(params: asset_descriptor_base & {
        fee?: number;
    }): Promise<data_for_external_asset_signing_tx>;
    /**
     * Emit asset
     */
    emit_asset(params: {
        asset_id: string;
        amount: number;
        fee?: number;
    }): Promise<data_for_external_asset_signing_tx>;
    /**
     * Update asset
     */
    update_asset(params: Partial<asset_descriptor_base> & {
        asset_id: string;
        fee?: number;
    }): Promise<data_for_external_asset_signing_tx>;
    /**
     * Burn asset
     */
    burn_asset(params: {
        asset_id: string;
        amount: number;
        fee?: number;
    }): Promise<data_for_external_asset_signing_tx>;
    /**
     * Attach asset descriptor
     */
    attach_asset_descriptor(params: any): Promise<{
        tx_hash: string;
    }>;
    /**
     * Transfer asset ownership
     */
    transfer_asset_ownership(params: {
        asset_id: string;
        new_owner: string;
        fee?: number;
    }): Promise<{
        tx_hash: string;
    }>;
    /**
     * Send externally signed asset transaction
     */
    send_ext_signed_asset_tx(params: {
        tx_unsigned_hex: string;
    }): Promise<{
        tx_hash: string;
    }>;
    /**
     * Get marketplace offers
     */
    marketplace_get_offers_ex(params: core_offers_filter): Promise<{
        offers: offer_details_ex[];
        total_offers: number;
    }>;
    /**
     * Push marketplace offer
     */
    marketplace_push_offer(params: any): Promise<{
        tx_hash: string;
    }>;
    /**
     * Update marketplace offer
     */
    marketplace_push_update_offer(params: any): Promise<{
        tx_hash: string;
    }>;
    /**
     * Cancel marketplace offer
     */
    marketplace_cancel_offer(params: {
        tx_id: string;
        offer_index: number;
        fee?: number;
    }): Promise<{
        tx_hash: string;
    }>;
    /**
     * Generate ionic swap proposal
     */
    ionic_swap_generate_proposal(params: {
        to_finalizer: transfer_destination;
        to_initiator: transfer_destination;
        mixins: number;
        fee_paid_by_a: boolean;
    }): Promise<{
        proposal: string;
    }>;
    /**
     * Get ionic swap proposal info
     */
    ionic_swap_get_proposal_info(params: {
        proposal: string;
    }): Promise<ionic_swap_proposal_info>;
    /**
     * Accept ionic swap proposal
     */
    ionic_swap_accept_proposal(params: {
        proposal: string;
    }): Promise<{
        tx_hash: string;
    }>;
    /**
     * Get all wallets
     */
    mw_get_wallets(params?: {}): Promise<{
        wallets: wallet_entry_info[];
    }>;
    /**
     * Select wallet
     */
    mw_select_wallet(params: {
        wallet_id: number;
    }): Promise<void>;
    /**
     * Sign message
     */
    sign_message(params: {
        buff: string;
    }): Promise<{
        signature: string;
    }>;
    /**
     * Encrypt data
     */
    encrypt_data(params: {
        decrypted_buff: string;
    }): Promise<{
        encrypted_buff: string;
    }>;
    /**
     * Decrypt data
     */
    decrypt_data(params: {
        encrypted_buff: string;
    }): Promise<{
        decrypted_buff: string;
    }>;
    /**
     * Get mining history
     */
    get_mining_history(params?: {}): Promise<mining_history>;
    /**
     * Get restore info
     */
    get_restore_info(params?: {}): Promise<restore_info>;
}
//# sourceMappingURL=ZanoWalletInstance.d.ts.map