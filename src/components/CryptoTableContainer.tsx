'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Search,
  Brightness4,
  Brightness7,
  ShowChart,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import {
  LoadingSpinner,
  TableSkeleton,
  StatsCardSkeleton,
  RefreshingIndicator
} from './LoadingSkeleton';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import type { CryptoData, ThemeProps } from '@/types';

export default function CryptoTableContainer({ onToggleTheme, darkMode }: ThemeProps) {
  const [data, setData] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const jsonData = await response.json();
      setData(jsonData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMarketStats = () => {
    if (data.length === 0) return null;

    const totalMarketCap = data.reduce((acc, coin) => acc + (coin.market_cap || 0), 0);
    const totalVolume = data.reduce((acc, coin) => acc + (coin.total_volume || 0), 0);
    const topGainer = data.reduce((prev, curr) => 
      (prev.price_change_percentage_24h || 0) > (curr.price_change_percentage_24h || 0) ? prev : curr
    );

    return {
      totalMarketCap,
      totalVolume,
      topGainer
    };
  };

  // Initial loading state
  if (loading && !data.length) {
    return (
      <Box sx={{ p: 3 }}>
        <LoadingSpinner 
          type="overlay" 
          text="Loading cryptocurrency data..." 
        />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error"
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={fetchData}
            >
              Refresh
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const marketStats = getMarketStats();

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: darkMode ? 'grey.900' : 'grey.50',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography 
          variant="h5" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          <ShowChart /> Crypto Dashboard
        </Typography>
        <IconButton onClick={onToggleTheme}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      {/* Market Stats */}
      <Grid container spacing={3} mb={4}>
        {loading ? (
          [...Array(3)].map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StatsCardSkeleton />
            </Grid>
          ))
        ) : marketStats && (
          <>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography color="text.secondary">Total Market Cap</Typography>
                <Typography variant="h4">
                  {formatCurrency(marketStats.totalMarketCap)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography color="text.secondary">24h Volume</Typography>
                <Typography variant="h4">
                  {formatCurrency(marketStats.totalVolume)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography color="text.secondary">Top Gainer (24h)</Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar 
                    src={marketStats.topGainer.image} 
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="h6">
                    {marketStats.topGainer.symbol.toUpperCase()}
                  </Typography>
                </Box>
                <Typography color="success.main">
                  {formatPercentage(marketStats.topGainer.price_change_percentage_24h)}
                </Typography>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>

      {/* Search */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: darkMode ? 'grey.800' : 'grey.200',
              },
              '&:hover fieldset': {
                borderColor: darkMode ? 'grey.700' : 'grey.300',
              },
            },
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">24h Change</TableCell>
              <TableCell align="right">Market Cap</TableCell>
              <TableCell align="right">Volume (24h)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton rowsCount={10} />
            ) : (
              filteredData.map((coin) => (
                <TableRow 
                  key={coin.id} 
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{coin.market_cap_rank}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar 
                        src={coin.image} 
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography>
                        {coin.name}
                      </Typography>
                      <Typography color="text.secondary">
                        ({coin.symbol.toUpperCase()})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(coin.current_price)}
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: coin.price_change_percentage_24h >= 0 
                        ? 'success.main' 
                        : 'error.main'
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                      {coin.price_change_percentage_24h >= 0 
                        ? <TrendingUp fontSize="small" /> 
                        : <TrendingDown fontSize="small" />
                      }
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(coin.market_cap)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(coin.total_volume)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Refresh Indicator */}
      {refreshing && <RefreshingIndicator />}
    </Box>
  );
}