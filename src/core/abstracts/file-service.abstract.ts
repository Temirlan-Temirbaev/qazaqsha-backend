import { Success } from 'src/shared/types/Success.type';

export abstract class IFileService {
  abstract validateType(file: Express.Multer.File, type: string): void;
  abstract saveFile(file: Uint8Array, name: string): Promise<string>;
  abstract deleteFile(fileName: string): Promise<Success>;
}
