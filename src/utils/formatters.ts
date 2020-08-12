// const base = 10e9

export const shannonToCKBFormatter = (
  shannon: string = '0',
  showPositiveSign?: boolean,
  delimiter: string = ',',
) => {
  if (Number.isNaN(+shannon)) {
    console.warn('Shannon is not a valid number');
    return shannon;
  }
  if (shannon === null) {
    return '0';
  }
  let sign = '';
  if (shannon.startsWith('-')) {
    sign = '-';
  } else if (showPositiveSign) {
    sign = '+';
  }
  const unsignedShannon = shannon.replace(/^-?0*/, '');
  let unsignedCKB = '';
  if (unsignedShannon.length <= 8) {
    unsignedCKB = `0.${unsignedShannon.padStart(8, '0')}`.replace(/\.?0+$/, '');
  } else {
    const decimal = `.${unsignedShannon.slice(-8)}`.replace(/\.?0+$/, '');
    const int = unsignedShannon.slice(0, -8).replace(/\^0+/, '');
    unsignedCKB = `${(
      int
        .split('')
        .reverse()
        .join('')
        .match(/\d{1,3}/g) || ['0']
    )
      .join(delimiter)
      .split('')
      .reverse()
      .join('')}${decimal}`;
  }
  return +unsignedCKB === 0 ? '0' : `${sign}${unsignedCKB}`;
};

export const truncateAddress = (address: string) =>
  `${address.substr(0, 10)}...${address.substr(address.length - 10, address.length)}`;

export const truncateHash = (hashParma: string) =>
  `${hashParma.substr(0, 10)}...${hashParma.substr(hashParma.length - 10, hashParma.length)}`;

export const numberToBigInt = (number: any) => {
  let result = Number(number) * 100;
  result *= 100;
  result *= 100;
  result *= 100;
  return BigInt(result);
};

export default {
  shannonToCKBFormatter,
  truncateAddress,
};
