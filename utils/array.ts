export const createDummyArray = (length: number) => {
  return new Array(length).fill(0).map((_, idx) => idx);
};
