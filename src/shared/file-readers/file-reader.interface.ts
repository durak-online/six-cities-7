export interface IFileReader<T> {
  read(path: string) : AsyncIterable<T>;
}
