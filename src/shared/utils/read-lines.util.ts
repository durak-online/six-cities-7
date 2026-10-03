import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

export async function* readLines(path: string): AsyncGenerator<string> {
  const stream = createReadStream(path, { encoding: 'utf-8' });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  try {
    for await (const line of rl) {
      yield line;
    }
  } finally {
    rl.close();
    stream.close();
  }
}
