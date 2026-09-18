import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const assetsDir = path.resolve(rootDir, 'src/assets');

// Helper to create an ICO file from PNG buffers
function createIco(pngEntries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(pngEntries.length, 4); // Count

  let offset = 6 + 16 * pngEntries.length;
  const dirEntries = [];
  const imageDatas = [];

  for (const { buffer, size } of pngEntries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Colors (0 = 256+)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset

    dirEntries.push(entry);
    imageDatas.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageDatas]);
}

// Official FoodFlow Brand Glyph (Burger on Shopping Cart / Delivery)
const GLYPH_PATHS = `
  <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M322 416c0 35.35-20.65 64-56 64H134c-35.35 0-56-28.65-56-64m258-80c17.67 0 32 17.91 32 40h0c0 22.09-14.33 40-32 40H64c-17.67 0-32-17.91-32-40h0c0-22.09 14.33-40 32-40"/>
  <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M344 336H179.31a8 8 0 0 0-5.65 2.34l-26.83 26.83a4 4 0 0 1-5.66 0l-26.83-26.83a8 8 0 0 0-5.65-2.34H56a24 24 0 0 1-24-24h0a24 24 0 0 1 24-24h288a24 24 0 0 1 24 24h0a24 24 0 0 1-24 24zM64 276v-.22c0-55 45-83.78 100-83.78h72c55 0 100 29 100 84v-.22M241 112l7.44 63.97"/>
  <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M256 480h139.31a32 32 0 0 0 31.91-29.61L463 112"/>
  <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m368 112 16-64 47-16"/>
  <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M224 112h256"/>
`;

async function buildAllAssets() {
  console.log('🚀 Generating FoodFlow white-label brand assets...');

  // Ensure directories exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Vector Favicon SVG (Scalable & Adaptive, 100% clean red badge)
  const faviconSvgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="112" fill="#dc2626"/>
  <g transform="translate(48, 48) scale(0.8125)">
    ${GLYPH_PATHS}
  </g>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvgContent, 'utf-8');
  console.log('✓ favicon.svg');

  // Base icon SVG helper
  const createIconSvg = (size = 512, bgColor = '#dc2626', rx = 112) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    ${bgColor ? `<rect width="512" height="512" rx="${rx}" fill="${bgColor}"/>` : ''}
    <g transform="translate(48, 48) scale(0.8125)">
      ${GLYPH_PATHS}
    </g>
  </svg>`;

  // 2. Favicons PNG (16x16, 32x32, 48x48, 64x64)
  const favMasterBuf = Buffer.from(createIconSvg(512, '#dc2626', 112));

  const png16 = await sharp(favMasterBuf).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);

  const png32 = await sharp(favMasterBuf).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);

  const png48 = await sharp(favMasterBuf).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);

  const favPng = await sharp(favMasterBuf).resize(64, 64).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), favPng);
  console.log('✓ favicon.png & sizes (16, 32, 48, 64)');

  // favicon.ico
  const icoBuf = createIco([
    { buffer: png16, size: 16 },
    { buffer: png32, size: 32 },
    { buffer: png48, size: 48 },
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log('✓ favicon.ico');

  // 3. Apple Touch Icon (180x180)
  const appleTouchBuf = await sharp(Buffer.from(createIconSvg(400, '#101014', 0)))
    .resize(180, 180)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchBuf);
  console.log('✓ apple-touch-icon.png');

  // 4. PWA Icons (192x192, 512x512)
  const pwa192Buf = await sharp(Buffer.from(createIconSvg(400, '#101014', 60)))
    .resize(192, 192)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192Buf);
  console.log('✓ pwa-192x192.png');

  const pwa512Buf = await sharp(Buffer.from(createIconSvg(400, '#101014', 80)))
    .resize(512, 512)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512Buf);
  console.log('✓ pwa-512x512.png');

  // 5. PWA Maskable (512x512 with safe margin)
  const pwaMaskableSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="#dc2626"/>
    <g transform="translate(80, 80) scale(0.6875)">
      ${GLYPH_PATHS}
    </g>
  </svg>`;
  const pwaMaskableBuf = await sharp(Buffer.from(pwaMaskableSvg))
    .resize(512, 512)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskableBuf);
  console.log('✓ pwa-maskable-512x512.png');

  // 6. Open Graph & Twitter Card in English (1200 x 630 px)
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a0d"/>
        <stop offset="60%" stop-color="#101015"/>
        <stop offset="100%" stop-color="#171720"/>
      </linearGradient>
      <radialGradient id="redGlow" cx="85%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#dc2626" stop-opacity="0.18"/>
        <stop offset="70%" stop-color="#dc2626" stop-opacity="0.01"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="1200" height="630" fill="url(#ogBg)"/>
    <rect width="1200" height="630" fill="url(#redGlow)"/>
    <rect width="1200" height="630" fill="url(#grid)"/>

    <!-- Subtle frame -->
    <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5"/>

    <!-- Top Brand Header -->
    <g transform="translate(72, 75)">
      <!-- Mini Badge with Official Glyph -->
      <rect x="0" y="0" width="48" height="48" rx="12" fill="#dc2626"/>
      <g transform="translate(6, 6) scale(0.0703)">
        ${GLYPH_PATHS}
      </g>
      
      <text x="64" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" letter-spacing="0.15em" fill="#ffffff">
        FOODFLOW
      </text>

      <g transform="translate(860, 4)">
        <rect x="0" y="0" width="180" height="36" rx="8" fill="rgba(220, 38, 38, 0.12)" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
        <text x="90" y="23" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" font-weight="700" letter-spacing="0.15em" fill="#f87171">
          WHITE-LABEL KIT
        </text>
      </g>
    </g>

    <!-- Center Hero Typography (English) -->
    <g transform="translate(72, 230)">
      <text x="0" y="0" font-family="ui-monospace, monospace" font-size="14" font-weight="700" letter-spacing="0.25em" fill="#ef4444" text-transform="uppercase">
        COMMERCIAL FOOD ORDERING &amp; WHATSAPP CHECKOUT
      </text>

      <text x="0" y="68" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="56" font-weight="900" letter-spacing="-0.03em" fill="#ffffff">
        Autonomous Digital Menu
      </text>
      <text x="0" y="136" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="56" font-weight="900" letter-spacing="-0.03em" fill="#ffffff">
        &amp; Direct Commission-Free Orders.
      </text>

      <text x="0" y="200" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#a1a1aa">
        React 19, Strict TypeScript, Tailwind CSS v4, PWA &amp; Instant WhatsApp Dispatch.
      </text>
    </g>

    <!-- Bottom Feature Bar (English) -->
    <g transform="translate(72, 536)">
      <line x1="0" y1="0" x2="1056" y2="0" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
      
      <text x="0" y="32" font-family="ui-monospace, monospace" font-size="13" font-weight="600" letter-spacing="0.15em" fill="#71717a">
        ZERO-BACKEND  •  WHATSAPP ENGINE  •  LCP &lt; 0.8S  •  CONFIG-DRIVEN
      </text>

      <g transform="translate(860, 32)">
        <circle cx="-12" cy="-4" r="4" fill="#22c55e"/>
        <text x="0" y="0" font-family="ui-monospace, monospace" font-size="13" font-weight="600" letter-spacing="0.12em" fill="#4ade80">
          READY TO DEPLOY
        </text>
      </g>
    </g>
  </svg>`;

  const ogSvgBuf = Buffer.from(ogSvg);

  const ogJpg = await sharp(ogSvgBuf).resize(1200, 630).jpeg({ quality: 90 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), ogJpg);

  const ogPng = await sharp(ogSvgBuf).resize(1200, 630).png({ compressionLevel: 8 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPng);

  const ogWebp = await sharp(ogSvgBuf).resize(1200, 630).webp({ quality: 90 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.webp'), ogWebp);
  console.log('✓ og-image.jpg, og-image.png & og-image.webp (English, 1200x630)');

  // 7. Minimalist Neutral Placeholder (src/assets/placeholder.webp)
  // Dimensions 600x600 px - Ultra lightweight, elegant dark food cloche silhouette
  const placeholderSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="pBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141418"/>
        <stop offset="100%" stop-color="#0c0c0f"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#pBg)"/>
    <!-- Subtle center dish/cloche food icon -->
    <g transform="translate(200, 200)" fill="none" stroke="#27272a" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <!-- Dish dome -->
      <path d="M20 130 C20 60 180 60 180 130 Z" fill="#18181b"/>
      <!-- Handle -->
      <circle cx="100" cy="50" r="10" stroke="#3f3f46"/>
      <!-- Plate tray base -->
      <line x1="0" y1="130" x2="200" y2="130" stroke="#3f3f46"/>
      <path d="M15 145 C60 160 140 160 185 145" stroke="#27272a" stroke-width="6"/>
    </g>
    <!-- Label -->
    <text x="300" y="410" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16" font-weight="600" letter-spacing="0.2em" fill="#52525b">
      FOODFLOW IMAGE
    </text>
  </svg>`;

  const placeholderWebp = await sharp(Buffer.from(placeholderSvg))
    .resize(600, 600)
    .webp({ quality: 85, effort: 6 })
    .toBuffer();
  fs.writeFileSync(path.join(assetsDir, 'placeholder.webp'), placeholderWebp);
  console.log('✓ src/assets/placeholder.webp (Neutral fallback, 600x600)');

  console.log('✨ All white-label brand assets generated successfully!');
}

buildAllAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
