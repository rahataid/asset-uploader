import S3Uploader from "./aws";

export interface S3UploaderConfig {
  accessKey: string;
  secret: string;
  region: string;
  bucket: string;
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
  uploadFile(uploadParams: UploadAssetParams): Promise<string>;
}

// todo: add other uploaders here

export interface AssetUploaderInstances {
  [AssetAvailableUploaders.S3]: S3Uploader;
  [AssetAvailableUploaders.DigitalOcean]: S3Uploader;
  [AssetAvailableUploaders.CloudFlare]: S3Uploader;
}

export type UploadAssetParams = {
  file: Buffer;
  mimeType: string;
  folderName: string;
  fileName: string;
  rootFolderName: string;
};
