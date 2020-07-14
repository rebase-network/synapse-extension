import puppeteer from 'puppeteer';

const path = require('path');

// Path to the actual extension we want to be testing
const pathToExtension = require('path').join(path.join(__dirname, '..', 'dist'));

// Tell puppeteer we want to load the web extension
const puppeteerArgs = [
  `--disable-extensions-except=${pathToExtension}`,
  `--load-extension=${pathToExtension}`,
  '--show-component-extension-options',
];

jest.setTimeout(30000);

describe('Google', () => {
  let page: puppeteer.Page;
  let browser: puppeteer.Browser;

  beforeAll(async () => {
    // browser = await puppeteer.launch();
    browser = await puppeteer.launch({
      headless: false,
      // headless: true,
      slowMo: 250,
      devtools: true,
      args: puppeteerArgs,
    });

    //   // Creates a new tab
    page = await browser.newPage();

    // navigates to some specific page
    await page.goto('https://google.com', { waitUntil: 'networkidle0' });
  });

  afterAll(async () => {
    // Tear down the browser
    await browser.close();
  });

  it('should display "google" text on page', async () => {
    await expect(page.title()).resolves.toMatch('Google');
  });
});
