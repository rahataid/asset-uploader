import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import {
  S3UploaderConfig,
  UploadAssetParams,
  UploaderAbstract,
} from '../types';
import { Readable } from 'stream';

export interface S3File {
  name: string;
  lastModified: Date;
  size: number;
}

class S3Uploader implements UploaderAbstract {
  private s3: S3Client;

  constructor(private config: S3UploaderConfig) {
    this.s3 = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secret,
      },
    });
  }

  async uploadFile(uploadParams: UploadAssetParams): Promise<any> {
    const Hash = require('ipfs-only-hash');
    const fileNameHash = await Hash.of(uploadParams.file);
    const params: PutObjectCommandInput = {
      Bucket: this.config.bucket,
      Key:
        uploadParams.rootFolderName +
        '/' +
        uploadParams.folderName +
        '/' +
        fileNameHash,
      Body: uploadParams.file,
      ACL: 'public-read',
      ContentType: uploadParams.mimeType,
      Tagging: uploadParams.rootFolderName,
    };

    console.log('params', params);

    const command = new PutObjectCommand(params);

    const result = await this.s3.send(command);

    return {
      ...result,
      fileNameHash,
    };
  }
  async uploadWithFileName(uploadParams: UploadAssetParams): Promise<any> {
    const params: PutObjectCommandInput = {
      Bucket: this.config.bucket,
      Key:
        uploadParams.rootFolderName +
        '/' +
        uploadParams.folderName +
        '/' +
        uploadParams.fileName,
      Body: uploadParams.file,
      ACL: 'public-read',
      ContentType: uploadParams.mimeType,
      Tagging: uploadParams.rootFolderName,
    };

    console.log('params', params);

    const command = new PutObjectCommand(params);

    const result = await this.s3.send(command);

    return {
      ...result,
      key: params.Key,
    };
  }

  async listFiles(): Promise<S3File[]> {
    const params = {
      Bucket: this.config.bucket,
    };

    const command = new ListObjectsV2Command(params);

    const result = await this.s3.send(command);

    if (!result.Contents || result.Contents.length === 0) {
      return [];
    }

    return result.Contents.map((file) => ({
      name: file.Key || '',
      lastModified: file.LastModified || new Date(),
      size: file.Size || 0,
    })) as S3File[];
  }

  async readFile(fileName: string): Promise<Buffer> {
    const params = {
      Bucket: this.config.bucket,
      Key: fileName,
    };

    const command = new GetObjectCommand(params);

    const result = await this.s3.send(command);

    return Buffer.from('');
    // return (result.Body as Readable) || Buffer.from("");
  }

  async deleteFile(fileName: string): Promise<void> {
    const params = {
      Bucket: this.config.bucket,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);

    await this.s3.send(command);
  }
}

export default S3Uploader;
