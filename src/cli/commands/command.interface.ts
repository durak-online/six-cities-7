export interface ICommand {
  getName(): string;
  getDescription(): string;
  execute(...params: string[]): void | Promise<void>;
  getUsage(): string;
}
