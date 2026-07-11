const { calculateCartTotal } = require('../../src/utils/cart');

describe('calculateCartTotal', () => {
  test('returns 0 for an empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  test('sums quantity * price across items', () => {
    const items = [
      { quantity: 2, product: { price: 10 } },
      { quantity: 1, product: { price: 5.5 } },
    ];
    expect(calculateCartTotal(items)).toBeCloseTo(25.5);
  });
});
