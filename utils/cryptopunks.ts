/**
 * Encode Crypto Punks media svg image. Should use this to encode it before pass it to `src` or `background-image`
 */
export function encodeSvg(svgString: string) {
  return svgString.replace(
    /[<>#%{}"]/g,
    (x) => "%" + x.charCodeAt(0).toString(16)
  );
}

export const getCryptoPunkUrl = (tokenId: number) => {
  return `https://cryptopunks.app/cryptopunks/details/${tokenId}`;
};

export function getCryptoPunkAccountInfoUrl(account: string) {
  return `https://cryptopunks.app/cryptopunks/accountInfo?account=${account}`;
}
