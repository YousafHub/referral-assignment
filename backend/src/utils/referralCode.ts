import crypto from 'crypto';

export function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 2).toUpperCase();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  const randomBytes = crypto.randomBytes(4);
  
  for (let i = 0; i < 4; i++) {
    const index = randomBytes[i] % chars.length;
    random += chars.charAt(index);
  }
  
  return `${prefix}${random}`;
}
