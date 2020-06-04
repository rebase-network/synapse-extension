import 'expect-puppeteer'

describe('test puppeteer', () => {
  beforeAll(async () => {
    await page.goto('https://so.com')
  })

  it('should display "360" text on so.com page', async () => {
    await expect(page).toMatch('360')
  })
})