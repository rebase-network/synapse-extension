import { parseSUDT } from '@utils/index';
import _ from 'lodash';

export interface UDTInfo {
  typeHash: string;
  capacity: string;
  outputdata: string;
}

export const aggregateUDT = (udtArr: UDTInfo[]) => {
  return udtArr.reduce((pre, cur) => {
    const result = pre;
    const shouldAddItsTypeHash = !_.has(pre, cur.typeHash);
    if (shouldAddItsTypeHash) {
      result[cur.typeHash] = {
        ckb: 0,
        udt: 0,
      };
    }
    if (cur.typeHash) {
      result[cur.typeHash].udt += parseSUDT(cur.outputdata);
    }
    result[cur.typeHash].ckb += parseInt(cur.capacity, 10);
    return result;
  }, {});
};

export default {
  aggregateUDT,
};
