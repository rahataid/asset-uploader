import { AssetUploaderInstances, AssetAvailableUploaders } from "./types";

class AssetUploader {
  private static instances: AssetUploaderInstances;
  private static uploader: AssetAvailableUploaders;

  static set(name: AssetAvailableUploaders, config: any): void {
    this.uploader = name;
    switch (name) {
      case AssetAvailableUploaders.S3:
        const S3Uploader = require("./aws").default;
        AssetUploader.instances[name] = new S3Uploader(config);
        break;
      // Add more cases for other uploaders here
      default:
        throw new Error(`Uploader '${name}' not supported`);
    }
  }

  static async upload(file: Buffer, fileName: string): Promise<string> {
    if (!AssetUploader.instances[this.uploader]) {
      throw new Error(`Uploader instance '${name}' not found`);
    }

    //   here AssetUploader should implement the UploaderAbstract interface

    return AssetUploader.instances[this.uploader].uploadFile(file, fileName);
  }
}

export default AssetUploader;
