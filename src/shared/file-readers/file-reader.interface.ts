export interface FileReader<T> {
  readFile(path: string) : T;
}
