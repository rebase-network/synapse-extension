import { hexToDecimal } from '@utils/index';

export interface UDTInfo {
  typeHash: string;
  capacity: string;
  outputdata: string;
  type: CKBComponents.Script;
}

export const aggregateUDT = (udtArr: UDTInfo[]) => {
  return udtArr.reduce((pre, cur) => {
    const result = pre;
    if (!Object.prototype.hasOwnProperty.call(pre, cur.typeHash)) {
      result[cur.typeHash] = {
        ckb: 0,
        udt: 0,
      };
    }
    result[cur.typeHash].udt += hexToDecimal(cur.outputdata, false);
    result[cur.typeHash].ckb += parseInt(cur.capacity, 10);
    return result;
  }, {});
};

export default {
  aggregateUDT,
};
