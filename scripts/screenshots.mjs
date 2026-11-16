import { chromium, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const base = process.env.DEMO_URL || 'http://127.0.0.1:4173'
const directory = new URL('../artifacts/', import.meta.url)
await mkdir(directory, { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
})
const issues = []
async function prepare(page) {
  page.on('pageerror', (error) => issues.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') issues.push(message.text())
  })
  page.on('response', (response) => {
    if (response.status() >= 400) issues.push(`${response.status()} ${response.url()}`)
  })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)
}
async function revealPage(page) {
  for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 600) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(150)
  }
  await page.waitForTimeout(900)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    page.viewportSize().width,
  )
}
async function shot(page, name, options = {}) {
  await page.screenshot({ path: new URL(name, directory).pathname, ...options })
}

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await prepare(page)
  await shot(page, 'desktop-hero.png')
  for (const [scene, name] of [
    ['Show fairy houses', 'desktop-fairy-scene.png'],
    ['Show personalised engraving', 'desktop-engraving-scene.png'],
  ]) {
    await page.getByRole('button', { name: scene }).click()
    await expect(page.getByRole('button', { name: scene })).toBeEnabled()
    await page.waitForTimeout(450)
    await shot(page, name)
  }
  await page.getByRole('button', { name: 'Show decorative clocks' }).click()
  await expect(page.getByRole('button', { name: 'Show decorative clocks' })).toBeEnabled()
  await revealPage(page)
  await shot(page, 'desktop-full.png', { fullPage: true })
  await shot(page, 'desktop-home.png', { clip: { x: 0, y: 0, width: 1440, height: 1900 } })
  await page.locator('.featured-card').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.waitForTimeout(650)
  await shot(page, 'desktop-product-detail.png')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.locator('#personalise').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await shot(page, 'desktop-studio.png')

  // Generate a visible demo enquiry through the actual form, in an isolated profile.
  await page.getByLabel('A few meaningful words').fill('For Ouma, with love')
  await page.getByRole('radio', { name: 'Handwritten' }).check()
  await page.getByRole('button', { name: 'Let’s make it yours' }).click()
  await page.getByLabel('Your name').fill('Demo Visitor')
  await page.getByLabel('WhatsApp number').fill('084 123 4567')
  await page.getByRole('spinbutton', { name: 'Quantity' }).fill('2')
  await page.getByRole('button', { name: 'Save demo enquiry' }).click()
  await expect(page.locator('.quote-success')).toBeVisible()
  await page.getByRole('link', { name: 'View the demo enquiry' }).click()
  await expect(page.locator('.enquiry-row')).toHaveCount(1)
  await shot(page, 'demo-dashboard.png')

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  })
  const phone = await mobile.newPage()
  await prepare(phone)
  await revealPage(phone)
  await shot(phone, 'mobile-full.png', { fullPage: true })
  await shot(phone, 'mobile-home.png', { clip: { x: 0, y: 0, width: 390, height: 920 } })
  await phone.locator('#personalise').scrollIntoViewIfNeeded()
  await phone.waitForTimeout(400)
  await shot(phone, 'mobile-studio.png')
  await phone.goto(`${base}/demo-dashboard`, { waitUntil: 'networkidle' })
  await expect(phone.getByRole('heading', { level: 1 })).toContainText('A place for')
  expect(await phone.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  await shot(phone, 'mobile-dashboard.png', { fullPage: true })
  expect(issues).toEqual([])
  console.log(
    'Desktop, mobile, all hero scenes, product detail, engraving studio and dashboard captured. Production browser errors: 0.',
  )
} finally {
  await browser.close()
}
