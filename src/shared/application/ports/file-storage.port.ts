export interface FileStoragePort {
  uploadFile(file: any, path: string): Promise<string>;
  getFileUrl(filePath: string): Promise<string>;
  deleteFile(filePath: string): Promise<boolean>;
} 