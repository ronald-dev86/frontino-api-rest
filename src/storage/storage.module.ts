import { Module } from '@nestjs/common';
import { FirebaseStorageAdapter } from '../shared/infrastructure/adapters/firebase-storage.adapter';
import { StorageController } from '../storage/controllers/storage.controller';
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';
import { GetFileUrlUseCase } from './application/use-cases/get-file-url.use-case';
import { DeleteFileUseCase } from './application/use-cases/delete-file.use-case';

@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: 'FILE_STORAGE_PORT',
      useClass: FirebaseStorageAdapter,
    },
    UploadFileUseCase,
    GetFileUrlUseCase,
    DeleteFileUseCase,
  ],
  exports: [UploadFileUseCase, GetFileUrlUseCase, DeleteFileUseCase],
})
export class StorageModule {}
