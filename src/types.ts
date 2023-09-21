import S3Uploader from "./aws";

export interface S3UploaderConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

export enum AssetAvailableUploaders {
  S3 = "S3",
  DigitalOcean = "DigitalOcean",
  CloudFlare = "CloudFlare",
}

export interface AssetUploaderInstancesConfig {
  [AssetAvailableUploaders.S3]: S3UploaderConfig;
  [AssetAvailableUploaders.DigitalOcean]: S3UploaderConfig;
  [AssetAvailableUploaders.CloudFlare]: S3UploaderConfig;
}

export interface UploaderAbstract {
  uploadFile(file: Buffer, fileName: string): Promise<string>;
}

// todo: add other uploaders here

export interface AssetUploaderInstances {
  [AssetAvailableUploaders.S3]: S3Uploader;
  [AssetAvailableUploaders.DigitalOcean]: S3Uploader;
  [AssetAvailableUploaders.CloudFlare]: S3Uploader;
}
