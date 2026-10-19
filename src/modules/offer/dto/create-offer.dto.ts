import { TCity, TConvenience, THousingType, TLocation } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city!: TCity;
  public previewUrl!: string;
  public photoUrls!: string[];
  public isPremium!: boolean;
  public housingType!: THousingType;
  public roomsCount!: number;
  public guestsCount!: number;
  public price!: number;
  public conveniences!: TConvenience[];
  public location!: TLocation;
}
