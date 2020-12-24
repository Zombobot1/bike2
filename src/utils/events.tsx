// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preventAndCall = (f: () => void) => (e: any) => {
  e.preventDefault();
  e.stopPropagation();
  f();
};

export { preventAndCall };
