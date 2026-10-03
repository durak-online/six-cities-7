import got from 'got';

export async function fetchJson<T>(url: string): Promise<T> {
  return got.get(url).json<T>();
}
