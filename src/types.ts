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
  tags: string[];
  lastBoosted: string;
  boostStatus: 'active' | 'syncing' | 'idle';
  affiliateCommission: number;
  stock: number;
  competitorsOutranked: number;
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
}

export interface ServerConnection {
  isConnected: true;
  environment: string;
  shopId: string;
  shopName: string;
  region: string;
  appKey: string;
  accessToken: string;
  tokenExpiresIn: number;
  webhookEndpoint: string;
  lastHandshake: string;
  latencyMs: number;
}
