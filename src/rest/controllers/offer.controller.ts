import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { IOfferService } from '../../modules/offer/index.js';
import { CreateOfferDto, UpdateOfferDto } from '../../modules/offer/index.js';
import { Component, TCity } from '../../types/index.js';
import { plainToInstance } from 'class-transformer';
import { BaseController } from './base-controller.js';
import { mapOfferToResponse } from '../../modules/offer/dto/offer-response.dto.js';

@injectable()
export class OfferController extends BaseController {
  public override path = '/offers';

  constructor(
    @inject(Component.IOfferService) private readonly offerService: IOfferService
  ) {
    super();
  }

  public override getRouter(): Router {
    const router = Router();

    router.get('/', asyncHandler(this.getMany.bind(this)));
    router.post('/', asyncHandler(this.create.bind(this)));
    router.get('/favorites', asyncHandler(this.getFavorites.bind(this)));
    router.get('/premium/:city', asyncHandler(this.getPremiumByCity.bind(this)));

    router.get('/:offerId', asyncHandler(this.getOne.bind(this)));
    router.patch('/:offerId', asyncHandler(this.updateOne.bind(this)));
    router.delete('/:offerId', asyncHandler(this.deleteOne.bind(this)));
    router.post('/:offerId/favorite', asyncHandler(this.postFavorite.bind(this)));
    router.delete('/:offerId/favorite', asyncHandler(this.deleteFavorite.bind(this)));

    return router;
  }

  private async getMany(
    req: Request<unknown, unknown, unknown, { limit: number }>,
    res: Response
  ): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : 60;
    const offers = await this.offerService.findAll(limit);
    this.ok(res, offers.map(mapOfferToResponse));
  }

  private async create(
    req: Request<unknown, unknown, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const dto = plainToInstance(CreateOfferDto, req.body);

    // заглушка для ID автора, пока нет JWT
    const mockAuthorId = '507f1f77bcf86cd799439011';

    const offer = await this.offerService.create(dto, mockAuthorId);
    this.created(res, mapOfferToResponse(offer));
  }

  private async getOne(
    req: Request<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);
    this.ok(res, mapOfferToResponse(offer));
  }

  private async updateOne(
    req: Request<{ offerId: string }, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const dto = plainToInstance(CreateOfferDto, req.body);

    // заглушка для ID автора, пока нет JWT
    const mockAuthorId = '507f1f77bcf86cd799439011';

    const offer = await this.offerService.updateById(req.params.offerId, dto, mockAuthorId);
    this.ok(res, mapOfferToResponse(offer));
  }

  private async deleteOne(
    req: Request<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    // заглушка для ID автора, пока нет JWT
    const mockAuthorId = '507f1f77bcf86cd799439011';

    await this.offerService.deleteById(req.params.offerId, mockAuthorId);

    this.noContent(res);
  }

  private async getPremiumByCity(
    req: Request<{ city: TCity }>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(req.params.city);
    this.ok(res, offers.map(mapOfferToResponse));
  }

  private async getFavorites(
    _req: Request,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.findFavorites();
    this.ok(res, offers.map(mapOfferToResponse));
  }

  private async postFavorite(
    req: Request<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.setFavorite(req.params.offerId, true);
    this.ok(res, mapOfferToResponse(offer));
  }

  private async deleteFavorite(
    req: Request<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.setFavorite(req.params.offerId, false);
    this.ok(res, mapOfferToResponse(offer));
  }
}
