export interface TikTokProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  targetKeyword: string;
  price: number;
  originalPrice: number;
  soldCount: number;
  rating: number;
  currentRank: number;
  previousRank: number;
  searchVolume: number;
  ctr: number;
  conversionRate: number;
  image: string;
  optimizedTitle: string;
  tokopediaTitle?: string;
  tags: string[];
  lastBoosted: string;
  boostStatus: 'active' | 'syncing' | 'idle';
  affiliateCommission: number;
  stock: number;
  competitorsOutranked: number;
  platform: 'both' | 'tiktok' | 'tokopedia';
  sourceUrl?: string;
  resolvedUrl?: string;
  tiktokRank: number;
  tokopediaRank: number;
  tokopediaBadge?: 'Official Store' | 'Power Merchant PRO';
  securityProtocol: string;
  lastLogId?: string;
  lastHttpStatus?: number;
  lastSignature?: string;
  sellerHandle?: string;
  externalProductId?: string;
  extractionSource?: 'partner_api' | 'share_metadata' | 'live_html' | 'redirect_slug' | 'user_input' | 'ai_semantic';
}

export interface SyncLog {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  action: string;
  status: 'success' | 'warning' | 'info';
  details: string;
  rankChange: string;
  apiLatencyMs: number;
  platform?: 'tiktok' | 'tokopedia' | 'both' | 'system';
  logId?: string;
  httpStatus?: number;
}

export interface ServerConnection {
  isConnected: boolean;
  environment: string;
  shopId: string;
  shopName: string;
  region: string;
  appKey: string;
  appSecret?: string;
  accessToken: string;
  tokenExpiresIn: number;
  webhookEndpoint: string;
  lastHandshake: string;
  latencyMs: number;
  apiEndpoint?: string;
  lastHttpStatus?: number;
  lastLogId?: string;
  authMode?: 'partner_api' | 'gateway_bridge';
  lastApiMessage?: string;
}

export interface TokopediaConnection {
  isConnected: boolean;
  shopId: string;
  shopName: string;
  fsId: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  webhookEndpoint: string;
  lastHandshake: string;
  latencyMs: number;
  tier: 'Official Store' | 'Power Merchant PRO';
  apiEndpoint?: string;
  lastHttpStatus?: number;
  lastLogId?: string;
  authMode?: 'partner_api' | 'gateway_bridge';
  lastApiMessage?: string;
}

export interface VtServerStatus {
  connected: boolean;
  endpoint: string;
  httpStatus: number;
  serverEngine: string;
  latencyMs: number;
  traceId: string;
  logId?: string;
  lastChecked: string;
  tlsVersion: string;
  jointGateway: string;
  rankSystemStatus: string;
}

export interface LiveSyncReport {
  resolvedUrl: string;
  redirectHops: number;
  httpStatus: number;
  latencyMs: number;
  logId: string;
  hmacSignature: string;
  extractionSource: 'partner_api' | 'share_metadata' | 'live_html' | 'redirect_slug' | 'user_input' | 'ai_semantic';
  needsManualReview: boolean;
  maxProductSlots?: number;
  batchCount?: number;
}
