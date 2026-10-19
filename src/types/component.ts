export const Component = {
  RestApp: Symbol.for('RestApp'),
  ILogger: Symbol.for('ILogger'),
  IConfig: Symbol.for('IConfig'),
  IDatabaseClient: Symbol.for('IDatabaseClient'),
  IUserService: Symbol.for('IUserService'),
  UserModel: Symbol.for('UserModel'),
  IOfferService: Symbol.for('IOfferService'),
  OfferModel: Symbol.for('OfferModel'),
  IFileReader: Symbol.for('IFileReader'),

  ImportCommand: Symbol.for('ImportCommand'),
} as const;
