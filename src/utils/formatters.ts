export const formatCurrency = (num: number, isCurrency: boolean = true) => {
  if (num >= 1e12) return `${isCurrency ? '$' : ''}${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${isCurrency ? '$' : ''}${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${isCurrency ? '$' : ''}${(num / 1e6).toFixed(2)}M`;
  return isCurrency ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                   : num.toFixed(2);
};

export const formatPercentage = (num: number) => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};