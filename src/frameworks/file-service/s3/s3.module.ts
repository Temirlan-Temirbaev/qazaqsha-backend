import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import {IFileService} from "../../../core/abstracts/file-service.abstract";

@Module({
  providers: [
    {
      useClass: S3Service,
      provide: IFileService,
    },
  ],
  exports: [IFileService],
})
export class S3Module {}
