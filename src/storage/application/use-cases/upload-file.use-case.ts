import { Inject, Injectable } from '@nestjs/common';
import { FileStoragePort } from '../../../shared/application/ports/file-storage.port';

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject('FILE_STORAGE_PORT')
    private readonly fileStoragePort: FileStoragePort,
  ) {}

  async execute(file: any, path: string): Promise<string> {
    return this.fileStoragePort.uploadFile(file, path);
  }
}
