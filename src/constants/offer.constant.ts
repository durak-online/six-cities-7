export const TITLE_LENGTH = { min: 10, max: 100 } as const;
export const DESCRIPTION_LENGTH = { min: 20, max: 1024 } as const;
export const PHOTOS_COUNT = 6;
export const RATING_RANGE = { min: 1, max: 5 } as const;
export const ROOMS_COUNT_RANGE = { min: 1, max: 8 } as const;
export const GUESTS_COUNT_RANGE = { min: 1, max: 10 } as const;
export const PRICE_RANGE = { min: 100, max: 100_000 } as const;
