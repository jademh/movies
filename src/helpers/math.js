// This function rounds a percentage to the nearest whole number
export function calculatePercentage(a, b) {
  return `${Math.round((a / b) * 100)}%`;
}