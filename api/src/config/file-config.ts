export type ValidImageExtension = 'png' | 'jpg' | 'jpeg';
export type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

export const MAX_IMAGE_SIZE: number = 5; // Mega Byte

export const validImageExtension: ValidImageExtension[] = [
  'jpeg',
  'jpg',
  'png',
];
export const validMimeType: ValidMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const FEE = '1500';

export const AVATAR_PATH = '/img/avatar';

export const PRICE_MEMBER = {
  reseller: '50000',
  ['reseller-nc']: '50000',
  distributor: '44000',
  ['reseller-up']: '44000',
  supplier: '41000',
};
