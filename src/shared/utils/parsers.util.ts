export function asIntInRange(value: string, min: number, max: number): number {
  const num = Number.parseInt(value, 10);

  if (Number.isNaN(num) || num < min || num > max) {
    throw new Error(`Invalid integer "${value}", expected range ${min}..${max}`);
  }

  return num;
}

export function asFloatInRange(value: string, min: number, max: number): number {
  const num = Number.parseFloat(value);

  if (Number.isNaN(num) || num < min || num > max) {
    throw new Error(`Invalid number "${value}", expected range ${min}..${max}`);
  }

  return num;
}

export function asBoolean(value: string): boolean {
  switch (value.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new Error(`Invalid boolean: "${value}"`);
  }
}

export function asDate(value: string): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: "${value}"`);
  }

  return date;
}

export function asStringInLenRange(value: string, minLength: number, maxLength: number): string {
  if (value.length < minLength || value.length > maxLength) {
    throw new Error(`Invalid string length ${value.length}, expected ${minLength}..${maxLength}`);
  }

  return value;
}
