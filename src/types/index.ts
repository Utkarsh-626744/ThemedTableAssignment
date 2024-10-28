export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  high_24h: number;
  low_24h: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof CryptoData;
  direction: SortDirection;
}

export interface ThemeProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}