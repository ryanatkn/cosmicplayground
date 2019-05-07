// aka lerp
export const mix = (a, b, amount) => {
  return (1 - amount) * a + amount * b;
};
