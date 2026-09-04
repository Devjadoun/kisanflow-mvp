const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env without displaying credentials
function getEnvCredentials() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, 'utf8');
  let url = '';
  let key = '';
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      url = trimmed.replace('VITE_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      key = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').trim();
    }
  }
  if (!url || !key) return null;
  if (url.includes('/rest/v1')) url = url.replace(/\/rest\/v1\/?$/, '');
  if (url.endsWith('/')) url = url.slice(0, -1);
  if (!url.startsWith('https://')) return null;
  return { url, key };
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verify() {
  const creds = getEnvCredentials();
  let liveSupabase = false;
  let supabaseDirectClient = null;

  if (creds) {
    try {
      supabaseDirectClient = createClient(creds.url, creds.key);
      const { data, error } = await supabaseDirectClient.from('centres').select('id');
      if (!error && data && data.length > 0) {
        liveSupabase = true;
      }
    } catch (e) {
      liveSupabase = false;
    }
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const consoleErrors = [];
  const browserLogs = [];
  page.on('console', msg => {
    browserLogs.push(msg.text());
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  let bookingInsertedInSupabase = false;
  let operatorSeesSameBooking = false;
  let statusPersistedInSupabase = false;
  let createdBookingId = null;
  let createdToken = null;

  try {
    // 1. Visit homepage
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

    // 2. Open Book Slot
    await page.goto('http://localhost:5173/farmer/book-slot', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    // Step 1: Dadri Centre
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[class*="cursor-pointer"]'));
      const dadriCard = cards.find(c => c.innerText.includes('Dadri'));
      if (dadriCard) dadriCard.click();
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Continue'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Step 2: Wheat
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[class*="cursor-pointer"]'));
      const wheatCard = cards.find(c => c.innerText.includes('Wheat'));
      if (wheatCard) wheatCard.click();
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Continue'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Step 3: Quantity 250 kg
    await page.evaluate(() => {
      const input = document.querySelector('input[type="number"]');
      if (input) {
        input.value = '250';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Continue'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Step 4: Date
    await page.evaluate(() => {
      const dateCards = Array.from(document.querySelectorAll('div[class*="cursor-pointer"]'));
      if (dateCards.length > 0) dateCards[0].click();
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Continue'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Step 5: Recommended slot & Confirm
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[class*="cursor-pointer"]'));
      const recCard = cards.find(c => c.innerText.includes('11:00 AM'));
      if (recCard) recCard.click();
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find(b => b.innerText.includes('Confirm & Generate Token'));
      if (confirmBtn) confirmBtn.click();
    });
    await page.waitForFunction(() => window.location.pathname.includes('/farmer/confirmation'), { timeout: 4000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    // Read generated booking details from confirmation page
    const bookingDetails = await page.evaluate(() => {
      const text = document.body.innerText;
      const tokenMatch = text.match(/A0\d+|A\d+/);
      const bookingMatch = text.match(/KF-2026-\d+/);
      return {
        token: tokenMatch ? tokenMatch[0] : null,
        bookingId: bookingMatch ? bookingMatch[0] : null,
      };
    });

    createdToken = bookingDetails.token;
    createdBookingId = bookingDetails.bookingId;

    // Verify insertion directly in Supabase
    if (supabaseDirectClient && createdBookingId) {
      // Retry for up to 3 seconds in case of slight async network propagation
      for (let i = 0; i < 6; i++) {
        const { data, error } = await supabaseDirectClient
          .from('bookings')
          .select('*')
          .eq('booking_id', createdBookingId)
          .maybeSingle();

        if (!error && data && data.booking_id === createdBookingId) {
          bookingInsertedInSupabase = true;
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // Check Operator Dashboard
    await page.goto('http://localhost:5173/operator', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    operatorSeesSameBooking = await page.evaluate((tok) => {
      return document.body.innerText.includes(tok);
    }, createdToken);

    // Operator changes status (e.g. click "Mark Arrived" on the booking row)
    const clickedStatus = await page.evaluate((tok) => {
      const rows = Array.from(document.querySelectorAll('tr'));
      const targetRow = rows.find(r => r.innerText.includes(tok));
      if (targetRow) {
        const btn = targetRow.querySelector('button');
        if (btn && btn.innerText.includes('Mark Arrived')) {
          btn.click();
          return true;
        }
      }
      const anyMarkArrived = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Mark Arrived'));
      if (anyMarkArrived) {
        anyMarkArrived.click();
        return true;
      }
      return false;
    }, createdToken);

    await new Promise(r => setTimeout(r, 1200));

    // Verify status persisted in Supabase database directly
    if (supabaseDirectClient && createdBookingId) {
      for (let i = 0; i < 6; i++) {
        const { data } = await supabaseDirectClient
          .from('bookings')
          .select('status')
          .eq('booking_id', createdBookingId)
          .maybeSingle();

        if (data && data.status.toLowerCase() === 'arrived') {
          statusPersistedInSupabase = true;
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }

  } catch (err) {
    console.error('Verification encountered an error:', err);
  } finally {
    await browser.close();
  }

  // Final structured output
  console.log('\n========================================');
  console.log('LIVE SUPABASE: ' + (liveSupabase ? 'YES' : 'NO'));
  console.log('Booking inserted: ' + (bookingInsertedInSupabase ? 'YES' : 'NO'));
  console.log('Operator sees same booking: ' + (operatorSeesSameBooking ? 'YES' : 'NO'));
  console.log('Status persisted: ' + (statusPersistedInSupabase ? 'YES' : 'NO'));
  console.log('Console errors: ' + consoleErrors.length);
  console.log('========================================\n');
}

verify();
