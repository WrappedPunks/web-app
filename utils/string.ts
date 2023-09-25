export const shortenString = (
  inputStr?: `0x${string}` | string | null,
  headNumberOfChar = 6,
  tailNumberOfChar = 4
) => {
  if (!inputStr) return "";

  const length = inputStr.length;

  if (length <= headNumberOfChar + tailNumberOfChar) {
    return inputStr;
  }

  const head = inputStr.substring(0, headNumberOfChar);
  const tail = inputStr.substring(length - tailNumberOfChar, length);

  return `${head}...${tail}`;
};
