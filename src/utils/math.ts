// aka lerp
export const mix = (a: number, b: number, amount: number): number => {
  return (1 - amount) * a + amount * b;
};
