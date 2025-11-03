/**
 * Entity type definitions for Zano Wallet
 * Based on plain_wallet_api_defs.h and wallet_public_structs_defs.h
 */

// ========== Basic Types ==========

export type blobdata = string;

// ========== Asset Types ==========

export interface AssetInfo {
  asset_id: string;
  current_supply: number;
  decimal_point: number;
  full_name: string;
  hidden_supply: boolean;
  meta_info: string;
  owner: string;
  ticker: string;
  total_max_supply: number;
}

export interface asset_balance_entry {
  asset_info: AssetInfo;
  awaiting_in: number;
  awaiting_out: number;
  total: number;
  unlocked: number;
}

export interface asset_descriptor_base {
  ticker: string;
  full_name: string;
  total_max_supply: number;
  current_supply?: number;
  decimal_point: number;
  meta_info: string;
  owner?: string;
  hidden_supply?: boolean;
}

export interface asset_descriptor_with_id extends asset_descriptor_base {
  asset_id: string;
}

// ========== Wallet Info Types ==========

export interface WalletInfo {
  address: string;
  balances: asset_balance_entry[];
  has_bare_unspent_outputs: boolean;
  is_auditable: boolean;
  is_watch_only: boolean;
  mined_total: number;
  path: string;
  view_sec_key: string;
}

export interface wallet_info_extra {
  wi: WalletInfo;
  seed: string;
  tracking_hey: string;
}

export interface wallet_extended_info {
  wi: WalletInfo;
  wi_extended?: wallet_info_extra;
}

export interface RecentHistory {
  last_item_index: number;
  total_history_items: number;
}

export interface open_wallet_response {
  name: string;
  pass: string;
  wallet_id: number;
  wi: WalletInfo;
  recent_history: RecentHistory;
  seed: string;
  recovered: boolean;
  wallet_local_bc_size: number;
  wallet_file_size: number;
}

export interface wallet_provision_info {
  balance: number;
  unlocked_balance: number;
  balances: asset_balance_entry[];
  transfers_count: number;
  transfer_entries_count: number;
  curent_height: number;
}

// ========== Wallet Status Types ==========

export interface WalletStatus {
  current_daemon_height: number;
  current_wallet_height: number;
  is_daemon_connected: boolean;
  is_in_long_refresh: boolean;
  progress: number;
  wallet_state: number;
}

export interface wallet_sync_status_info extends WalletStatus {}

export interface app_connectivity_status {
  is_online: boolean;
  is_server_busy: boolean;
  last_daemon_is_disconnected: boolean;
  last_proxy_communicate_timestamp: number;
}

// ========== Address Types ==========

export interface AddressInfo {
  valid: boolean;
  auditable: boolean;
  payment_id: boolean;
  wrap: boolean;
}

export interface seed_phrase_info {
  syntax_correct: boolean;
  require_password: boolean;
  hash: string;
  tracking_seed: string;
}

// ========== Transaction Types ==========

export interface transfer_destination {
  address: string;
  amount: number;
  asset_id?: string;
}

export interface tx_service_attachment {
  type: string;
  flags?: number;
  b?: string;  // comment
  rh?: string; // royalty_handler
  rp?: number; // royalty_percent
  [key: string]: any;
}

export interface wallet_transfer_info {
  tx_id?: string;
  tx_hash: string;
  tx_blob_size: number;
  tx_type: number;
  amount: number;
  fee: number;
  height: number;
  timestamp: number;
  comment: string;
  is_income: boolean;
  is_service: boolean;
  is_mixing: boolean;
  is_mining: boolean;
  show_sender: boolean;
  unlock_time: number;
  td?: transfer_details;
  subtransfers?: wallet_sub_transfer_info[];
  employed_entries?: employed_tx_entry[];
  contract?: escrow_contract_details[];
  selected_indicies?: number[];
  remote_aliases?: string[];
  encryption_key?: string;
  marketplace_entries?: any[];
  extra?: any;
}

export interface wallet_transfer_info_old extends wallet_transfer_info {}

export interface wallet_sub_transfer_info {
  is_income: boolean;
  amount: number;
  asset_id: string;
}

export interface transfer_details {
  rcv: transfer_destination[];
  spn: transfer_destination[];
}

export interface employed_tx_entry {
  index: number;
  amount: number;
  asset_id?: string;
}

export interface escrow_contract_details {
  contract_id: string;
  is_a: boolean;
  state: number;
  private_detailes: string;
  timestamp: number;
  expiration_time: number;
  cancel_expiration_time: number;
  amount_a_pledge: number;
  amount_b_pledge: number;
  amount_to_pay: number;
  payment_id: string;
}

export interface payment_details {
  payment_id: string;
  tx_hash: string;
  amount: number;
  block_height: number;
  unlock_time: number;
}

// ========== Alias Types ==========

export interface alias_rpc_details_base {
  alias: string;
  address?: string;
  tracking_key?: string;
  comment?: string;
}

export interface alias_rpc_details extends alias_rpc_details_base {}

// ========== Asset Operations ==========

export interface data_for_external_asset_signing_tx {
  tx_id: string;
  tx_unsigned_hex: string;
  transfers: wallet_transfer_info[];
}

// ========== Marketplace Types ==========

export interface core_offers_filter {
  offset?: number;
  limit?: number;
  order_by?: number;
  category?: string;
  keyword?: string;
  location_country?: string;
  location_city?: string;
  rate_from?: string;
  rate_to?: string;
  payment_types?: string[];
  timestamp_start?: number;
  timestamp_stop?: number;
  amount_from?: number;
  amount_to?: number;
  bonus?: string;
  primary?: string;
  target?: string;
  fee_mode?: string;
}

export interface offer_details_ex {
  offer_id?: string;
  ap: string;  // amount_primary
  at: string;  // amount_target
  b: string;   // bonus
  cat: string; // category
  cnt: string; // contact
  com: string; // comment
  do: string;  // deal_option
  et: number;  // expiration_time
  fee: number;
  index_in_tx: number;
  lci: string; // location_city
  lco: string; // location_country
  ot: number;  // offer_type
  p: string;   // payment_types
  pt: string;  // target
  t: number;   // timestamp
  tx_hash: string;
  tx_original_hash: string;
  security?: string;
  [key: string]: any;
}

// ========== Ionic Swap Types ==========

export interface ionic_swap_proposal_info {
  mixins: number;
  fee_paid_by_a: boolean;
  to_finalizer: {
    address: string;
    amount: number;
    asset_id?: string;
  };
  to_initiator: {
    address: string;
    amount: number;
    asset_id?: string;
  };
}

// ========== Multiwallet Types ==========

export interface wallet_entry_info {
  wallet_id: number;
  wallet_name: string;
  address: string;
  is_current: boolean;
}

// ========== Mining Types ==========

export interface mining_history {
  mined_entries: any[];
}

// ========== Restore Types ==========

export interface restore_info {
  seed_phrase: string;
  seed_password?: string;
}

// ========== Contract Types ==========

export interface contract_private_details {
  [key: string]: any;
}

export interface contracts_array {
  contracts: any[];
}

export interface htlc_entry_info {
  [key: string]: any;
}

// ========== API Response Types ==========

export enum API_RETURN_CODE {
  OK = 'OK',
  FAIL = 'FAIL',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_FILE = 'INVALID_FILE',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  WRONG_SEED = 'WRONG_SEED',
  WALLET_WRONG_ID = 'WALLET_WRONG_ID',
  WALLET_WATCH_ONLY_NOT_SUPPORTED = 'WALLET_WATCH_ONLY_NOT_SUPPORTED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
}

export enum WALLET_RPC_ERROR_CODE {
  WRONG_ADDRESS = 'WRONG_ADDRESS',
  DAEMON_IS_BUSY = 'DAEMON_IS_BUSY',
  GENERIC_TRANSFER_ERROR = 'GENERIC_TRANSFER_ERROR',
  WRONG_PAYMENT_ID = 'WRONG_PAYMENT_ID',
  NOT_ENOUGH_MONEY = 'NOT_ENOUGH_MONEY',
  WRONG_ARGUMENT = 'WRONG_ARGUMENT',
}

export interface ErrorCode<T = string> {
  error_code: T;
}

export interface ReturnCode<T = API_RETURN_CODE> {
  return_code: T;
}

export interface JSONRpcSuccessfulResponse<T = any> {
  jsonrpc: '2.0';
  id: number;
  result: T;
}

export interface JSONRpcFailedResponse<T = any> {
  jsonrpc: '2.0';
  id: number;
  error: {
    code: number;
    message: string;
    data?: T;
  };
}

export type JSONRpcResponse<T = any> = JSONRpcSuccessfulResponse<T> | JSONRpcFailedResponse;

export interface ApiResponse<T = any> {
  id: number;
  jsonrpc: string;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

export interface SimpleResult {
  return_code: API_RETURN_CODE;
}

export interface WalletFilesResult {
  items: string[];
}

export interface AsyncJobResponse {
  job_id: number;
}

// ========== Daemon RPC Types ==========

export interface block_header_response {
  major_version: number;
  minor_version: number;
  timestamp: number;
  prev_id: string;
  nonce: number;
  height: number;
  depth: number;
  hash: string;
  difficulty: string;
  reward: number;
  type: string;
  actual_timestamp: number;
  cumulative_diff_adjusted: string;
  cumulative_diff_precise: string;
  is_orphan: boolean;
  base_reward: number;
  total_fee: number;
  penalty: number;
  summary_reward: number;
  block_cumulative_size: number;
  this_block_fee_median: number;
  effective_fee_median: number;
  transactions_count: number;
}

export interface block_rpc_extended_info extends block_header_response {
  transactions_ids: string[];
  miner_text_info: string;
}

export interface tx_rpc_brief_info {
  id: string;
  timestamp: number;
  fee: number;
  sz: number;
  pub_key: string;
  keeper_block: number;
}

export interface tx_rpc_extended_info extends tx_rpc_brief_info {
  blob: string;
  blob_size: number;
  attachments: tx_service_attachment[];
  ins: any[];
  outs: any[];
  extra: any[];
}

export interface daemon_network_state {
  [key: string]: any;
}

export interface bc_performance_data {
  [key: string]: any;
}

export interface pool_performance_data {
  [key: string]: any;
}

export interface maintainers_info_external {
  [key: string]: any;
}

export interface pos_entry {
  amount: number;
  keyimage: string;
  wallet_index: number;
  block_timestamp: number;
  stake_unlock_time: number;
}

export interface vote_results {
  [key: string]: any;
}

export interface outs_index_stat {
  [key: string]: any;
}

export interface tx_generation_context {
  [key: string]: any;
}

export enum RANDOM_OUTPUTS_FOR_AMOUNTS_FLAGS {
  MINIMUM_ELIGBLE_HEIGHT = 0x01
}

export type epee_hexemizer = string;

// ========== Enums ==========

export enum ZanoLogLevel {
  DISABLED = -1,
  DEFAULT = 0,
  TRACE = 1,
  DEBUG = 2,
  INFO = 3,
  WARNING = 4,
  ERROR = 5,
  FATAL = 6
}

export enum ZanoPriority {
  DEFAULT = 0,
  LOW = 1,
  NORMAL = 2,
  HIGH = 3
}
