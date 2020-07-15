import puppeteer from 'puppeteer';
import path from 'path';

jest.setTimeout(300000);

// Path to the actual extension we want to be testing
const pathToExtension = require('path').join(path.join(__dirname, '..', 'dist'));

// Tell puppeteer we want to load the web extension
const puppeteerArgs = [
  `--disable-extensions-except=${pathToExtension}`,
  `--load-extension=${pathToExtension}`,
  '--show-component-extension-options',
];

const extensionId = 'dbmnckdibkgoeppfmploopnghhgnnnmf';
const chromeExtPath = `chrome-extension://${extensionId}/popup.html`;

describe('Import Mnemonic', () => {
  let page: puppeteer.Page;
  let browser: puppeteer.Browser;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false,
      headless: true,
      slowMo: 250,
      devtools: true,
      args: puppeteerArgs,
    });

    // Creates a new tab
    page = await browser.newPage();

    await page.goto(chromeExtPath, { waitUntil: 'domcontentloaded' });
  });

  afterAll(async () => {
    // Tear down the browser
    await browser.close();
  });

  it('should render initial page normally', async () => {
    const header = await page.$('h6');
    expect(header).not.toBeNull();
    // FIXME: why it does not work?
    // await expect(page).toMatch('Synapse');
    await expect(page.title()).resolves.toMatch('Synapse extension');
    const button = await page.$('#import-button');
    expect(button).not.toBeNull();
  });

  it('should go to import mnemonic page', async () => {
    await page.click('#import-button');
    const header = await page.$('h3');
    expect(header).not.toBeNull();
  });

  it('should import mnemonic correctly', async () => {
    await page.type(
      '[name="mnemonic"]',
      'gym cycle pool joke bamboo airport ridge choose vote raw perfect bus',
    );
    await page.type('[name="password"]', '111111');
    await page.type('[name="confirmPassword"]', '111111');

    await page.click('#submit-button');
  });

  it('should go to address page', async () => {
    const addressElem = await page.$('[data-testid="address-info"]');
    expect(addressElem).not.toBeNull();
    // FIXME: why it does not work?
    // await expect(page).toMatch('ckt1qyqgad...l56qum0yyn');
  });
});
