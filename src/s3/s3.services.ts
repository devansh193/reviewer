import {
  GetObjectCommand,
  PutObjectCommand,
  S3,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const PUT_ASSETS_EXPIRES_IN = 4 * 60;
export const GET_ASSETS_EXPIRED_IN = 4 * 60 * 60;
export const FOLDER = "attachment";

export interface S3DriverOptions extends S3ClientConfig {
  bucketName: string;
  region: string;
}

export class S3Service {
  private s3Client: S3;
  private bucketName: string;
  constructor(options: S3DriverOptions) {
    const { bucketName, region, ...s3options } = options;
    if (!(bucketName && region)) {
      throw new Error("Bucket name and region are required");
    }
    this.s3Client = new S3({ ...s3options, region });
    this.bucketName = bucketName;
  }

  async getUrlToUpload(params: { key: string; mimeType: string }) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${FOLDER}/${params.key}`,
      ContentType: params.mimeType,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: PUT_ASSETS_EXPIRES_IN,
    });
    return {
      url,
      path: `${FOLDER}/${params.key}`,
    };
  }
  async getSignedAssetUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, {
      expiresIn: GET_ASSETS_EXPIRED_IN,
    });
  }
  async deleteSignedFile(key: string) {
    return this.s3Client.deleteObject({
      Bucket: this.bucketName,
      Key: key,
    });
  }
}
