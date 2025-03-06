import axios from "axios";

const BASE_PATH = "https://dev.resume.artemislabs.in.s3.amazonaws.com";

export const generateS3Url = (path?: string | null) => {
  if (!path) return;
  if (path.startsWith("https:")) return path;
  return `${BASE_PATH}/${path}`;
};

export async function uploadFileToS3({
  preSignedUrl,
  file,
}: {
  preSignedUrl: string;
  file: File;
}) {
  try {
    const result = await axios.put(preSignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    return result;
  } catch (error) {
    console.log("Error uploading file to S3", error);
    return undefined;
  }
}
