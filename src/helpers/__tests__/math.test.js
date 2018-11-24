import { calculatePercentage } from '../math';

test('Calculate percentage', () => {
  expect(calculatePercentage(0.2,100)).toBe('0%');
  expect(calculatePercentage(0.6,100)).toBe('1%');
  expect(calculatePercentage(50,100)).toBe('50%');
  expect(calculatePercentage(2,2)).toBe('100%');
  expect(calculatePercentage(3,2)).toBe('150%');
});