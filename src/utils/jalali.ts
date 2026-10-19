// تبدیل تقویم جلالی و ابزارهای اعداد و واحد پول فارسی
export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

const breaks = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
  1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
];

function div(a: number, b: number): number {
  return ~~(a / b);
}

function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

function jalCal(jy: number): { leap: number; march: number } {
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14, jp = breaks[0];
  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
    + div(153 * mod(gm + 9, 12) + 2, 5)
    + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const jdn = g2d(gy, gm, gd);
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  let jm: number, jd: number;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): Date {
  const r = jalCal(jy);
  const gy = jy + 621;
  let days = jd - 1;
  for (let m = 1; m < jm; m += 1) {
    days += m <= 6 ? 31 : (m <= 11 ? 30 : (r.leap === 1 ? 30 : 29));
  }
  const jdn = g2d(gy, 3, r.march) + days;
  const g = d2g(jdn);
  return new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
}

export function getTodayJalali(): string {
  const now = new Date();
  const j = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`;
}

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

export const PERSIAN_WEEKDAYS = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
];

export function toPersianDigits(num: number | string): string {
  if (num === null || num === undefined) return '';
  const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (d) => pDigits[parseInt(d, 10)]);
}

export function formatRial(amount: number): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return `${formatted} ریال`;
}

export function formatToman(amount: number): string {
  const toman = Math.floor(amount / 10);
  const formatted = new Intl.NumberFormat('fa-IR').format(toman);
  return `${formatted} تومان`;
}

export function canonicalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  // Convert Persian/Arabic digits to ASCII
  let p = phone.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776))
               .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632));
  // Remove non-digit characters
  p = p.replace(/[\s\-\(\)\.]/g, '');
  if (p.startsWith('00989')) return '09' + p.substring(5);
  if (p.startsWith('+989')) return '09' + p.substring(4);
  if (p.startsWith('989')) return '09' + p.substring(3);
  if (p.startsWith('9') && p.length === 10) return '0' + p;
  return p;
}
