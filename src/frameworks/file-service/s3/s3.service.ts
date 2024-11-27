import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { IFileService } from 'src/core/abstracts/file-service.abstract';
import { Success } from 'src/shared/types/Success.type';
import * as uuid from 'uuid';
import * as mime from 'mime-types';
import { FileTypesEnum } from 'src/shared/enums/FileTypes.enum';
import { FILE_TYPES } from 'src/shared/constants/FileTypes.const';
@Injectable()
export class S3Service implements IFileService {
  private s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      endpoint: process.env.AWS_URL,
      accessKeyId: process.env.MINIO_ROOT_USER,
      secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  validateType(file: Express.Multer.File, type: FileTypesEnum) {
    if (!FILE_TYPES[type].includes(file.mimetype)) {
      throw new BadRequestException(`Wrong type of file ${file.originalname}`);
    }
    return;
  }

  async saveFile(file: Uint8Array, name: string): Promise<string> {
    try {
      const extension = `.${name.split('.').pop()}`;
      const key = uuid.v4() + extension;

      const buffer = Buffer.from(file);
      const contentType =
        mime.contentType(extension) || 'application/octet-stream';

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      };

      const result = await this.s3.upload(uploadParams).promise();
      return result.Key;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async deleteFile(fileName: string): Promise<Success> {
    try {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
      };

      await this.s3.deleteObject(deleteParams).promise();
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
