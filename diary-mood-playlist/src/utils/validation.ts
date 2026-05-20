import { DIARY_MIN_LENGTH, DIARY_MAX_LENGTH } from '../constants';

export function validateDiaryInput(text: string) {
  const length = text.length;
  return {
    isValid: length >= DIARY_MIN_LENGTH && length <= DIARY_MAX_LENGTH,
    isTooShort: length < DIARY_MIN_LENGTH,
    isTooLong: length >= DIARY_MAX_LENGTH,
    length,
  };
}
