import { CapacityUnit } from './const';

const base = 10e9;
const numberParser = (value: string, exchange: string) => {
  if (Number.isNaN(+value)) {
    throw new TypeError('Value is not a valid number');
  }
  if (Number.isNaN(+exchange)) {
    throw new TypeError('Exchange is not a valid number');
  }
  const res = (BigInt(value) * BigInt(+exchange * base)).toString();
  const integer = res.slice(0, res.length - 10);
  const decimal = res.slice(res.length - 10).replace(/0+$/, '');
  return [integer, decimal];
};

const numberFormatter = new Intl.NumberFormat('en-US');
const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export const queryFormatter = (params: { [index: string]: any }) => {
  const newQuery = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    newQuery.set(key, `${value}`);
  });
  return newQuery;
};

export type currencyCode = 'CKB' | 'CNY' | 'USD';
/**
 *
 *
 * @function currencyFormatter
 * @param {string} value
 * @param {('CKB' | 'CNY' | 'USD')} [type='CKB']
 * @param {string} [exchange='0.000000001']
 * @description display balance in the format of xxx,xxx.xxxxxxxx CKB (yyy,yyy.yy CNY)
 * @returns
 */
export const currencyFormatter = (
  shannons: string = '0',
  unit: currencyCode = 'CKB',
  exchange: string = '0.000000001',
): string => {
  if (Number.isNaN(+shannons)) {
    throw new TypeError(`Shannons is not a valid number`);
  }

  if (Number.isNaN(+exchange)) {
    throw new TypeError(`Exchange is not a valid number`);
  }

  const [integer, decimal] = numberParser(shannons, exchange);
  const dot = '.';
  const delimiter = ',';
  switch (unit) {
    case 'CKB':
    case 'CNY': {
      break;
    }
    default: {
      break;
    }
  }
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter)}${dot}${decimal} ${unit}`;
};

export const CKBToShannonFormatter = (
  amount: string = '0',
  unit: CapacityUnit = CapacityUnit.CKB,
) => {
  if (Number.isNaN(+amount)) {
    console.warn(`Amount is not a valid number`);
    return `${amount} ${unit}`;
  }
  const [integer = '0', decimal = ''] = amount.split('.');
  const decimalLength = 10 ** decimal.length;
  const num = integer + decimal;

  switch (unit) {
    case CapacityUnit.CKB: {
      return (BigInt(num) * BigInt(1e8 / decimalLength)).toString();
    }
    case CapacityUnit.CKKB: {
      return (BigInt(num) * BigInt(1e11 / decimalLength)).toString();
    }
    case CapacityUnit.CKGB: {
      return (BigInt(num) * BigInt(1e17 / decimalLength)).toString();
    }
    default: {
      return amount;
    }
  }
};

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

export const localNumberFormatter = (num: string | number | bigint = 0) => {
  if (num === '' || num === undefined || num === null) {
    return '';
  }
  if (typeof num === 'bigint') {
    return numberFormatter.format(num as any);
  }
  if (Number.isNaN(+num)) {
    console.warn(`Number is not a valid number`);
    return num.toString();
  }
  const parts = num.toString().split('.');
  const n: any = BigInt(parts[0]);
  parts[0] = numberFormatter.format(n);
  return parts.join('.');
};

export const uniformTimeFormatter = (time: string | number | Date) => {
  return timeFormatter.format(+time).replace(/\//g, '-');
};

export default {
  queryFormatter,
  currencyFormatter,
  CKBToShannonFormatter,
  shannonToCKBFormatter,
  localNumberFormatter,
  uniformTimeFormatter,
};
