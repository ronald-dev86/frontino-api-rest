import { Inject, Injectable } from '@nestjs/common';
import { FileStoragePort } from '../../../shared/application/ports/file-storage.port';

@Injectable()
export class DeleteFileUseCase {
  constructor(
    @Inject('FILE_STORAGE_PORT')
    private readonly fileStoragePort: FileStoragePort,
  ) {}

  async execute(filePath: string): Promise<boolean> {
    return this.fileStoragePort.deleteFile(filePath);
  }
} 