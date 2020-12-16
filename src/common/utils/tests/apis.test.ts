import axios from 'axios';
import { aliceWallet } from '@src/tests/fixture/address';
import setupKeyper from '@background/keyper/setupKeyper';
import NetworkManager from '@common/networkManager';
import {
  getAddressInfo,
  getUnspentCells,
  getTxHistories,
  getUDTsByLockHash,
  getUnspentCapacity,
} from '../apis';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apis', () => {
  beforeAll(async () => {
    await NetworkManager.initNetworks();
    await setupKeyper();
  });

  it('getAddressInfo', async () => {
    const resp = { data: { data: { capacity: '0x01' }, errCode: 0 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getAddressInfo('0x01');
    expect(result).toEqual(resp.data.data);
  });

  it('getAddressInfo with error', async () => {
    const resp = { data: { data: '123', errCode: 1 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getAddressInfo('123');
    expect(result).toEqual(resp.data);
  });

  it('getAddressInfo with error returned', async () => {
    const resp = { data: { data: '123', errCode: 1 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getAddressInfo('123');
    expect(result).toEqual(resp.data);
  });

  it('getUnspentCells', async () => {
    const resp = { data: { data: '123', errCode: 0 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getUnspentCells('123', { limit: '1' });
    expect(result).toEqual(resp.data.data);
  });

  it('getUnspentCells with error', async () => {
    const resp = { data: { data: '123', errCode: 0 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getUnspentCells('123', { limit: '1' });
    expect(result).toEqual(resp.data.data);
  });

  it('getUnspentCells with error returned', async () => {
    const resp = { data: { data: '123', errCode: 1 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getUnspentCells('123', { limit: '1' });
    expect(result).toEqual(resp.data);
  });

  it('getTxHistories', async () => {
    const resp = { data: { data: '123', errCode: 0 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getTxHistories('123');
    expect(result).toEqual(resp.data.data);
  });

  it('getUDTsByLockHash', async () => {
    const resp = { data: { data: '123', errCode: 0 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getUDTsByLockHash({
      lockHash: '123',
      typeScripts: [
        {
          args: '0x123',
          codeHash: '0x123',
          hashType: 'type',
        },
      ],
    });
    expect(result).toEqual(resp.data.data);
  });

  it('getUnspentCapacity with error', async () => {
    const resp = { data: { data: '123', errCode: 1 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getUnspentCapacity('123');
    expect(result).toEqual(resp.data);
  });

  it('getUnspentCapacity with empty capacity', async () => {
    const resp = { data: { emptyCapacity: 100 }, errCode: 0 };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getUnspentCapacity('123');
    expect(result).toEqual(resp.data);
  });

  it('getUnspentCapacity with error returned', async () => {
    const resp = { data: { data: '123', errCode: 1 } };
    mockedAxios.get.mockResolvedValue(resp);
    const result = await getUnspentCapacity('123');
    expect(result).toEqual(resp.data);
  });
});
