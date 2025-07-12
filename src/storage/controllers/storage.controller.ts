import { Controller, Post, UseInterceptors, UploadedFile, Param, Delete, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '../application/use-cases/upload-file.use-case';
import { GetFileUrlUseCase } from '../application/use-cases/get-file-url.use-case';
import { DeleteFileUseCase } from '../application/use-cases/delete-file.use-case';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly getFileUrlUseCase: GetFileUrlUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) {}

  @Post(':folder')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Param('folder') folder: string,
  ) {
    const fileUrl = await this.uploadFileUseCase.execute(file, folder);
    return { url: fileUrl };
  }

  @Get(':filePath')
  async getFileUrl(@Param('filePath') filePath: string) {
    const url = await this.getFileUrlUseCase.execute(filePath);
    return { url };
  }

  @Delete(':filePath')
  async deleteFile(@Param('filePath') filePath: string) {
    const deleted = await this.deleteFileUseCase.execute(filePath);
    return { success: deleted };
  }
}
