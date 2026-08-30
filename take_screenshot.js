import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function capture() {
  const publicDir = path.join(__dirname, '../public/assets');
  const profileImgPath = path.join(publicDir, 'profile.jpg');
  let profileBase64 = '';
  if (fs.existsSync(profileImgPath)) {
    const imgBuf = fs.readFileSync(profileImgPath);
    profileBase64 = `data:image/jpeg;base64,${imgBuf.toString('base64')}`;
  }

  const genPdfFile = fs.readFileSync(path.join(__dirname, 'generate-pdf.js'), 'utf8');
  const match = genPdfFile.match(/const htmlContent = `([\s\S]*?)`;/);
  if (!match) {
    console.error('Could not extract htmlContent');
    return;
  }
  let html = match[1];
  html = html.replace('${profileBase64}', profileBase64);

  const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  
  const outPath = path.join(__dirname, 'pdf_preview.png');
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();
  console.log(`Screenshot saved to ${outPath}`);
}

capture();
