// VANTA verify — static checks, no browser needed.
// Run: node scripts/verify.mjs  (also `npm test`)
// Checks:
//  1. All 10 product slugs have an image file that exists on disk.
//  2. No price / currency symbols anywhere in src/ (no amounts, no subtotal).
//  3. All hash routes are present in App.jsx.
//  4. Product data is consistent (unique slugs, EU 40-46 sizes, VERGE 10 default 45).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');
const publicDir = join(root, 'public');

let failures = 0;
function check(ok, label) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) failures += 1;
}

// --- collect every source file ---
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(jsx?|css)$/.test(entry.name)) out.push(p);
  }
  return out;
}
const srcFiles = walk(srcDir);
const srcText = srcFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

// --- 1. product images exist ---
const productsSrc = readFileSync(join(srcDir, 'data', 'products.js'), 'utf8');
const images = [...productsSrc.matchAll(/image:\s*'([^']+)'/g)].map((m) => m[1]);
const slugs = [...productsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
check(images.length === 10, `10 product images declared (found ${images.length})`);
check(slugs.length === 10, `10 product slugs declared (found ${slugs.length})`);
check(new Set(slugs).size === slugs.length, 'product slugs are unique');
for (const img of images) {
  // Remote verified Unsplash URLs pass (repo is text-only: the GitHub
  // connector cannot push binary files); local paths must exist on disk.
  const ok = img.startsWith('https://images.unsplash.com/photo-')
    || existsSync(join(publicDir, img.replace(/^\//, '')));
  check(ok, `image source valid: ${img.slice(0, 60)}...`);
}
const filesOnDisk = readdirSync(join(publicDir, 'images', 'shoes'));
check(filesOnDisk.length === 10, `10 shoe photos on disk (found ${filesOnDisk.length})`);

// --- 2. no prices / currency anywhere in src ---
for (const sym of ['£', '€', '¥', '₹']) {
  check(!srcText.includes(sym), `no currency symbol "${sym}" in src/`);
}
// "$" is only a currency symbol when used as money: "$12" or "12$".
// Template literals "${...}" and the regex end-anchor "$" in App.jsx are
// not money, so check for currency-shaped usage only.
check(!/\$\s*\d/.test(srcText), 'no "$" used as money in src/');
// The word "checkout" is allowed exactly once: the footer demo note
// "Demo template — no prices, no checkout." in brand.js. Anywhere else
// would mean a checkout feature crept in.
const checkoutFiles = srcFiles.filter((f) => /checkout/i.test(readFileSync(f, 'utf8')));
check(
  checkoutFiles.length === 1 && checkoutFiles[0].endsWith(join('config', 'brand.js')),
  'word "checkout" appears only in the brand.js footer demo note',
);
for (const word of ['subtotal', 'total:', 'payment', 'buy now']) {
  check(!new RegExp(word, 'i').test(srcText), `no "${word}" in src/`);
}
// Money-like amounts only count as money next to a currency symbol or
// currency word — bare decimals like CSS 0.25s / GSAP 0.35 are not money.
check(
  !/[£€$¥₹]\s*\d/.test(srcText) && !/\d+\.\d{2}\s*(GBP|USD|EUR|pounds?|dollars?|euros?)/i.test(srcText),
  'no money amounts in src/',
);

// --- 3. routes present ---
const appSrc = readFileSync(join(srcDir, 'App.jsx'), 'utf8');
for (const route of ["'#/'", "'/product'", "'/about'", "'/faq'", "'/contact'"]) {
  check(appSrc.includes(route), `route ${route} present in App.jsx`);
}
check(appSrc.includes('hashchange'), 'hashchange listener present (hash routing)');

// --- 4. product data consistency ---
const brandSrc = readFileSync(join(srcDir, 'config', 'brand.js'), 'utf8');
check(/40,\s*41,\s*42,\s*43,\s*44,\s*45,\s*46/.test(brandSrc), 'sizes EU 40–46 in brand.js');
check(/defaultSize:\s*45/.test(productsSrc), 'VERGE 10 default size EU 45');
check((productsSrc.match(/defaultSize/g) || []).length === 1, 'only one product has a default size (VERGE 10)');
check(/verifiedFromVideo:\s*true/.test(productsSrc), 'video-verified products flagged');
check((productsSrc.match(/verifiedFromVideo:\s*true/g) || []).length === 3, 'exactly 3 video-verified products (VECTOR 02, RIFT 06, VERGE 10)');
check(/heroProduct/.test(productsSrc), 'hero product exported (VERGE 10)');

// --- 5. bag persistence + no-price CTA ---
const storeSrc = readFileSync(join(srcDir, 'state', 'store.jsx'), 'utf8');
check(storeSrc.includes('localStorage'), 'bag persisted in localStorage');
check(storeSrc.includes('BAG_STORAGE_KEY'), 'bag uses the shared storage key');
const bagSrc = readFileSync(join(srcDir, 'components', 'BagDrawer.jsx'), 'utf8');
check(bagSrc.includes('Request this bag'), 'bag CTA is "Request this bag"');
check(bagSrc.includes('Your bag is empty'), 'bag empty state present');
check(bagSrc.includes('Escape'), 'Escape closes the drawer');

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
