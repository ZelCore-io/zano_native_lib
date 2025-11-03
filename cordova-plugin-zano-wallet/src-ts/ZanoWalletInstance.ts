/**
 * ZanoWalletInstance - High-level wallet instance API
 * Wraps a wallet_id and provides typed methods for all wallet operations
 */

import { ZanoWalletPlugin } from './ZanoWalletPlugin';
import type {
  open_wallet_response,
  WalletInfo,
  WalletStatus,
  asset_balance_entry,
  wallet_provision_info,
  wallet_transfer_info,
  transfer_destination,
  payment_details,
  asset_descriptor_base,
  asset_descriptor_with_id,
  data_for_external_asset_signing_tx,
  offer_details_ex,
  core_offers_filter,
  ionic_swap_proposal_info,
  wallet_entry_info,
  mining_history,
  restore_info,
  alias_rpc_details
} from './entities';

export class ZanoWalletInstance {
  public readonly wallet_id: number;
  public readonly name: string;
  public wi: WalletInfo;
  public seed: string;
  public recovered: boolean;

  constructor(response: open_wallet_response) {
    this.wallet_id = response.wallet_id;
    this.name = response.name;
    this.wi = response.wi;
    this.seed = response.seed;
    this.recovered = response.recovered;
  }

  /**
   * Internal method to invoke wallet RPC methods
   */
  private async _invoke<T>(method: string, params: any = {}): Promise<T> {
    const response = await ZanoWalletPlugin.invoke(this.wallet_id, {
      method,
      params,
    });

    if (response.error) {
      throw new Error(`Wallet RPC Error: ${response.error.message}`);
    }

    return response.result as T;
  }

  // ========== Core Wallet Methods ==========

  /**
   * Get wallet status
   */
  async getStatus(): Promise<WalletStatus> {
    return ZanoWalletPlugin.getWalletStatus(this.wallet_id);
  }

  /**
   * Update wallet info
   */
  async updateWalletInfo(): Promise<WalletInfo> {
    const info = await ZanoWalletPlugin.getWalletInfo(this.wallet_id);
    this.wi = info;
    return info;
  }

  /**
   * Close wallet
   */
  async close(): Promise<void> {
    await ZanoWalletPlugin.closeWallet(this.wallet_id);
  }

  /**
   * Reset wallet password
   */
  async resetPassword(newPassword: string): Promise<void> {
    await ZanoWalletPlugin.resetWalletPassword(this.wallet_id, newPassword);
  }

  /**
   * Store wallet to disk
   */
  async store(): Promise<{ wallet_file_size: number }> {
    return this._invoke('store', {});
  }

  // ========== Balance & Address Methods ==========

  /**
   * Get wallet balances
   */
  async getbalance(params: {} = {}): Promise<{
    balance: number;
    unlocked_balance: number;
    balances: asset_balance_entry[];
  }> {
    return this._invoke('getbalance', params);
  }

  /**
   * Get wallet address
   */
  async getaddress(params: {} = {}): Promise<{ address: string }> {
    return this._invoke('getaddress', params);
  }

  /**
   * Get extended wallet info
   */
  async get_wallet_info(params: {} = {}): Promise<{
    address: string;
    path: string;
    transfers_count: number;
    transfer_entries_count: number;
    is_watch_only: boolean;
    has_bare_unspent_outputs: boolean;
    current_height: number;
  }> {
    return this._invoke('get_wallet_info', params);
  }

  // ========== Transaction History Methods ==========

  /**
   * Get recent transactions and info
   */
  async get_recent_txs_and_info(params: {
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
  }> {
    return this._invoke('get_recent_txs_and_info', params);
  }

  /**
   * Get recent transactions and info (v2)
   */
  async get_recent_txs_and_info2(params: {
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
  }> {
    return this._invoke('get_recent_txs_and_info2', params);
  }

  /**
   * Search for transactions
   */
  async search_for_transactions(params: {
    tx_id?: string;
    filter_by_height?: boolean;
    min_height?: number;
    max_height?: number;
    in?: boolean;
    out?: boolean;
    pending?: boolean;
    failed?: boolean;
    pool?: boolean;
  }): Promise<{ transfers: wallet_transfer_info[] }> {
    return this._invoke('search_for_transactions', params);
  }

  /**
   * Search for transactions (v2)
   */
  async search_for_transactions2(params: any): Promise<any> {
    return this._invoke('search_for_transactions2', params);
  }

  // ========== Transfer Methods ==========

  /**
   * Send a transaction
   */
  async transfer(params: {
    destinations: transfer_destination[];
    fee: number;
    mixin?: number;
    payment_id?: string;
    comment?: string;
    push_payer?: boolean;
    hide_receiver?: boolean;
    service_entries_permanent?: boolean;
  }): Promise<{ tx_hash: string; tx_unsigned_hex?: string }> {
    return this._invoke('transfer', params);
  }

  /**
   * Sign transfer (without broadcasting)
   */
  async sign_transfer(params: any): Promise<{ tx_unsigned_hex: string }> {
    return this._invoke('sign_transfer', params);
  }

  /**
   * Submit signed transfer
   */
  async submit_transfer(params: { tx_unsigned_hex: string }): Promise<{ tx_hash: string }> {
    return this._invoke('submit_transfer', params);
  }

  /**
   * Sweep outputs below threshold
   */
  async sweep_below(params: { address: string; amount: number; fee: number; mixin: number }): Promise<{ tx_hash: string }> {
    return this._invoke('sweep_below', params);
  }

  /**
   * Get bare outputs statistics
   */
  async get_bare_outs_stats(params: {} = {}): Promise<any> {
    return this._invoke('get_bare_outs_stats', params);
  }

  /**
   * Sweep bare outputs
   */
  async sweep_bare_outs(params: any): Promise<{ tx_hash: string }> {
    return this._invoke('sweep_bare_outs', params);
  }

  // ========== Payment Methods ==========

  /**
   * Get payments by payment ID
   */
  async get_payments(params: { payment_id: string }): Promise<{ payments: payment_details[] }> {
    return this._invoke('get_payments', params);
  }

  /**
   * Get bulk payments
   */
  async get_bulk_payments(params: {
    payment_ids: string[];
    min_block_height?: number;
  }): Promise<{ payments: payment_details[] }> {
    return this._invoke('get_bulk_payments', params);
  }

  // ========== Address Methods ==========

  /**
   * Create integrated address
   */
  async make_integrated_address(params: { payment_id?: string }): Promise<{
    integrated_address: string;
    payment_id: string;
  }> {
    return this._invoke('make_integrated_address', params);
  }

  /**
   * Split integrated address
   */
  async split_integrated_address(params: { integrated_address: string }): Promise<{
    address: string;
    payment_id: string;
  }> {
    return this._invoke('split_integrated_address', params);
  }

  // ========== Alias Methods ==========

  /**
   * Register alias
   */
  async register_alias(params: {
    alias: string;
    address?: string;
    comment?: string;
  }): Promise<{ tx_hash: string }> {
    return this._invoke('register_alias', params);
  }

  /**
   * Update alias
   */
  async update_alias(params: alias_rpc_details): Promise<{ tx_hash: string }> {
    return this._invoke('update_alias', params);
  }

  // ========== Asset Methods ==========

  /**
   * Get asset whitelist
   */
  async assets_whitelist_get(params: {} = {}): Promise<{ assets: asset_descriptor_with_id[] }> {
    return this._invoke('assets_whitelist_get', params);
  }

  /**
   * Add asset to whitelist
   */
  async assets_whitelist_add(params: { asset_id: string }): Promise<void> {
    return this._invoke('assets_whitelist_add', params);
  }

  /**
   * Remove asset from whitelist
   */
  async assets_whitelist_remove(params: { asset_id: string }): Promise<void> {
    return this._invoke('assets_whitelist_remove', params);
  }

  /**
   * Deploy new asset
   */
  async deploy_asset(params: asset_descriptor_base & {
    fee?: number;
  }): Promise<data_for_external_asset_signing_tx> {
    return this._invoke('deploy_asset', params);
  }

  /**
   * Emit asset
   */
  async emit_asset(params: {
    asset_id: string;
    amount: number;
    fee?: number;
  }): Promise<data_for_external_asset_signing_tx> {
    return this._invoke('emit_asset', params);
  }

  /**
   * Update asset
   */
  async update_asset(params: Partial<asset_descriptor_base> & {
    asset_id: string;
    fee?: number;
  }): Promise<data_for_external_asset_signing_tx> {
    return this._invoke('update_asset', params);
  }

  /**
   * Burn asset
   */
  async burn_asset(params: {
    asset_id: string;
    amount: number;
    fee?: number;
  }): Promise<data_for_external_asset_signing_tx> {
    return this._invoke('burn_asset', params);
  }

  /**
   * Attach asset descriptor
   */
  async attach_asset_descriptor(params: any): Promise<{ tx_hash: string }> {
    return this._invoke('attach_asset_descriptor', params);
  }

  /**
   * Transfer asset ownership
   */
  async transfer_asset_ownership(params: {
    asset_id: string;
    new_owner: string;
    fee?: number;
  }): Promise<{ tx_hash: string }> {
    return this._invoke('transfer_asset_ownership', params);
  }

  /**
   * Send externally signed asset transaction
   */
  async send_ext_signed_asset_tx(params: { tx_unsigned_hex: string }): Promise<{ tx_hash: string }> {
    return this._invoke('send_ext_signed_asset_tx', params);
  }

  // ========== Marketplace Methods ==========

  /**
   * Get marketplace offers
   */
  async marketplace_get_offers_ex(params: core_offers_filter): Promise<{
    offers: offer_details_ex[];
    total_offers: number;
  }> {
    return this._invoke('marketplace_get_offers_ex', params);
  }

  /**
   * Push marketplace offer
   */
  async marketplace_push_offer(params: any): Promise<{ tx_hash: string }> {
    return this._invoke('marketplace_push_offer', params);
  }

  /**
   * Update marketplace offer
   */
  async marketplace_push_update_offer(params: any): Promise<{ tx_hash: string }> {
    return this._invoke('marketplace_push_update_offer', params);
  }

  /**
   * Cancel marketplace offer
   */
  async marketplace_cancel_offer(params: { tx_id: string; offer_index: number; fee?: number }): Promise<{ tx_hash: string }> {
    return this._invoke('marketplace_cancel_offer', params);
  }

  // ========== Ionic Swap Methods ==========

  /**
   * Generate ionic swap proposal
   */
  async ionic_swap_generate_proposal(params: {
    to_finalizer: transfer_destination;
    to_initiator: transfer_destination;
    mixins: number;
    fee_paid_by_a: boolean;
  }): Promise<{ proposal: string }> {
    return this._invoke('ionic_swap_generate_proposal', params);
  }

  /**
   * Get ionic swap proposal info
   */
  async ionic_swap_get_proposal_info(params: { proposal: string }): Promise<ionic_swap_proposal_info> {
    return this._invoke('ionic_swap_get_proposal_info', params);
  }

  /**
   * Accept ionic swap proposal
   */
  async ionic_swap_accept_proposal(params: { proposal: string }): Promise<{ tx_hash: string }> {
    return this._invoke('ionic_swap_accept_proposal', params);
  }

  // ========== Multiwallet Methods ==========

  /**
   * Get all wallets
   */
  async mw_get_wallets(params: {} = {}): Promise<{ wallets: wallet_entry_info[] }> {
    return this._invoke('mw_get_wallets', params);
  }

  /**
   * Select wallet
   */
  async mw_select_wallet(params: { wallet_id: number }): Promise<void> {
    return this._invoke('mw_select_wallet', params);
  }

  // ========== Cryptography Methods ==========

  /**
   * Sign message
   */
  async sign_message(params: { buff: string }): Promise<{ signature: string }> {
    return this._invoke('sign_message', params);
  }

  /**
   * Encrypt data
   */
  async encrypt_data(params: { decrypted_buff: string }): Promise<{ encrypted_buff: string }> {
    return this._invoke('encrypt_data', params);
  }

  /**
   * Decrypt data
   */
  async decrypt_data(params: { encrypted_buff: string }): Promise<{ decrypted_buff: string }> {
    return this._invoke('decrypt_data', params);
  }

  // ========== Mining Methods ==========

  /**
   * Get mining history
   */
  async get_mining_history(params: {} = {}): Promise<mining_history> {
    return this._invoke('get_mining_history', params);
  }

  // ========== Restore Methods ==========

  /**
   * Get restore info
   */
  async get_restore_info(params: {} = {}): Promise<restore_info> {
    return this._invoke('get_restore_info', params);
  }
}
