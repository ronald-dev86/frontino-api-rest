import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FileStoragePort } from '../../application/ports/file-storage.port';

@Injectable()
export class FirebaseStorageAdapter implements FileStoragePort {
  private readonly storage: admin.storage.Storage;
  private readonly bucketName: string;

  constructor() {
    this.storage = admin.storage();
    this.bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'default-bucket';
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const filePath = `${path}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(filePath);

    const fileStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => {
        reject(`Error al subir archivo: ${error}`);
      });

      fileStream.on('finish', async () => {
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
        resolve(publicUrl);
      });

      fileStream.end(file.buffer);
    });
  }

  async getFileUrl(filePath: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(filePath);
    
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error(`El archivo ${filePath} no existe`);
    }

    await file.makePublic();
    return `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(filePath);
    
    const [exists] = await file.exists();
    if (!exists) {
      return false;
    }

    await file.delete();
    return true;
  }
}
