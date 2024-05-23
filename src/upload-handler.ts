import {
  AssetUploaderInstances,
  AssetAvailableUploaders,
  UploadAssetParams,
} from './types';

class AssetUploader {
  private static instances: AssetUploaderInstances | any = {};
  private static uploaderName: AssetAvailableUploaders;

  static set(name: AssetAvailableUploaders, config: any): void {
    this.uploaderName = name;
    switch (name) {
      case AssetAvailableUploaders.S3:
        const S3Uploader = require('./aws').default;
        AssetUploader.instances[name] = new S3Uploader(config);
        break;
      // Add more cases for other uploaderNames here
      default:
        throw new Error(`Uploader '${name}' not supported`);
    }
  }

  static async upload(uploadParams: UploadAssetParams): Promise<string> {
    if (!AssetUploader.instances[this.uploaderName]) {
      throw new Error(`Uploader instance '${this.uploaderName}' not found`);
    }

    return AssetUploader.instances[this.uploaderName].uploadFile(uploadParams);
  }
  static async uploadWithFileName(
    uploadParams: UploadAssetParams
  ): Promise<string> {
    if (!AssetUploader.instances[this.uploaderName]) {
      throw new Error(`Uploader instance '${this.uploaderName}' not found`);
    }

    return AssetUploader.instances[this.uploaderName].uploadWithFileName(
      uploadParams
    );
  }
}

export default AssetUploader;
