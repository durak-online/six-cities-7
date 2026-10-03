import { createWriteStream, WriteStream } from 'node:fs';
import { RentalOffer } from '../../types/index.js';
import { TSV_LIST_SEPARATOR } from '../../constants/index.js';
import { IFileWriter } from './file-writer.interface.js';

export class TSVWriter implements IFileWriter<RentalOffer> {
  private readonly stream: WriteStream;

  constructor(path: string) {
    this.stream = createWriteStream(path, { encoding: 'utf-8' });
  }

  public async write(offer: RentalOffer): Promise<void> {
    const line = `${this.serialize(offer)}\n`;

    if (!this.stream.write(line)) {
      await new Promise<void>((resolve) => this.stream.once('drain', resolve));
    }
  }

  public async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.stream.end((err?: Error | null) => (err ? reject(err) : resolve()));
    });
  }

  private serialize(offer: RentalOffer): string {
    return [
      offer.title,
      offer.description,
      offer.publishDate.toISOString(),
      offer.city,
      offer.previewUrl,
      offer.photoUrls.join(TSV_LIST_SEPARATOR),
      String(offer.isPremium),
      String(offer.isFavorite),
      offer.rating.toFixed(1),
      offer.housingType,
      String(offer.roomsCount),
      String(offer.guestsCount),
      String(offer.price),
      offer.conveniences.join(TSV_LIST_SEPARATOR),
      offer.author.email,
      String(offer.commentsCount),
      `${offer.location.latitude}${TSV_LIST_SEPARATOR}${offer.location.longitude}`,
    ].join('\t');
  }
}
