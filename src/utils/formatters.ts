// const base = 10e9

export const shannonToCKBFormatter = (
  shannon: string = '0',
  showPositiveSign?: boolean,
  delimiter: string = ',',
) => {
  if (Number.isNaN(+shannon)) {
    console.warn(`Shannon is not a valid number`);
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

export default {
  shannonToCKBFormatter,
};
