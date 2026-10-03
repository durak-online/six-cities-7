export interface IFileWriter<T> {
  write(data: T): Promise<void>;
  close(): Promise<void>;
}
