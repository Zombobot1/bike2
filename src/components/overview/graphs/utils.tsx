export const lineGraphTicks = (max: number, roundTo: number, tickStep: number) => {
  const result = [];
  const roundedMax = Math.ceil(max / roundTo) * roundTo;
  for (let i = 0; i < roundedMax; i += roundedMax / tickStep) result.push(Math.round(i));
  result.push(roundedMax);
  return result;
};
