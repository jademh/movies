// This function rounds a percentage to the nearest whole number
export function calculatePercentage(a, b) {
  if(a===0 && b===0) {
    return '0%';
  }
  return `${Math.round((a / b) * 100)}%`;
}