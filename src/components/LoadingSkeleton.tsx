import {
  Box,
  CircularProgress,
  Skeleton,
  Typography,
  LinearProgress,
  useTheme,
  TableRow,
  TableCell,
} from '@mui/material';

// Main Loading Spinner Component
interface LoadingSpinnerProps {
  type?: 'circular' | 'linear' | 'skeleton' | 'overlay';
  text?: string;
}

export const LoadingSpinner = ({ type = 'circular', text }: LoadingSpinnerProps) => {
  const theme = useTheme();

  switch (type) {
    case 'overlay':
      return (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: theme.zIndex.modal,
          }}
        >
          <CircularProgress color="primary" size={60} />
          {text && (
            <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
              {text}
            </Typography>
          )}
        </Box>
      );

    case 'linear':
      return (
        <Box sx={{ width: '100%', position: 'relative' }}>
          <LinearProgress />
          {text && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              {text}
            </Typography>
          )}
        </Box>
      );

    case 'skeleton':
      return (
        <Box sx={{ width: '100%' }}>
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
        </Box>
      );

    default:
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={40} />
          {text && (
            <Typography variant="body2" color="text.secondary">
              {text}
            </Typography>
          )}
        </Box>
      );
  }
};

// Table Loading Components
export const TableRowSkeleton = () => (
  <TableRow>
    {[...Array(6)].map((_, index) => (
      <TableCell key={index}>
        <Skeleton animation="wave" />
      </TableCell>
    ))}
  </TableRow>
);

export const TableSkeleton = ({ rowsCount = 5 }: { rowsCount?: number }) => (
  <>
    {[...Array(rowsCount)].map((_, index) => (
      <TableRowSkeleton key={index} />
    ))}
  </>
);

// Card Loading Components
export const CardSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton animation="wave" height={20} width="60%" sx={{ mb: 1 }} />
    <Skeleton animation="wave" height={40} />
  </Box>
);

// Stats Card Loading
export const StatsCardSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton animation="wave" height={24} width="40%" sx={{ mb: 1 }} />
    <Skeleton animation="wave" height={48} width="70%" />
  </Box>
);

// Refresh Indicator
export const RefreshingIndicator = () => (
  <Box
    sx={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      bgcolor: 'background.paper',
      p: 1,
      borderRadius: 1,
      boxShadow: 2,
    }}
  >
    <CircularProgress size={20} />
    <Typography variant="caption">Refreshing data...</Typography>
  </Box>
);