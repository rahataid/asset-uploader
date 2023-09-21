import AWS, { S3 } from "aws-sdk";
import { S3UploaderConfig, UploaderAbstract } from "../types";

export interface S3File {
  name: string;
  lastModified: Date;
  size: number;
}

class S3Uploader implements UploaderAbstract {
  private s3: S3;

  constructor(private config: S3UploaderConfig) {
    this.s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
    });
  }

  async uploadFile(file: Buffer, fileName: string): Promise<string> {
    const params = {
      Bucket: this.config.bucketName,
      Key: fileName,
      Body: file,
    };

    const result = await this.s3.upload(params).promise();

    return result.Location;
  }

  async listFiles(): Promise<S3File[]> {
    const params = {
      Bucket: this.config.bucketName,
    };

    const result = await this.s3.listObjectsV2(params).promise();

    if (!result.Contents || result.Contents.length === 0) {
      return [];
    }

    return result.Contents.map((file) => ({
      name: file.Key || "",
      lastModified: file.LastModified || new Date(),
      size: file.Size || 0,
    })) as S3File[];
  }

  async readFile(fileName: string): Promise<Buffer> {
    const params = {
      Bucket: this.config.bucketName,
      Key: fileName,
    };

    const result = await this.s3.getObject(params).promise();

    return (result.Body as Buffer) || Buffer.from("");
  }

  async deleteFile(fileName: string): Promise<void> {
    const params = {
      Bucket: this.config.bucketName,
      Key: fileName,
    };

    await this.s3.deleteObject(params).promise();
  }
}

export default S3Uploader;
