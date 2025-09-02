import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import env from '@/env'
import { v4 as uuidv4 } from 'uuid'

// Initialize S3 client
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
})

export interface UploadImageResult {
  url: string
  key: string
  fileName: string
  fileSize: number
  mimeType: string
}

/**
 * Uploads an image to S3 and returns the URL and metadata
 */
export const uploadImageToS3 = async (
  file: Buffer,
  originalFileName: string,
  mimeType: string,
  folder: string = 'task-proofs'
): Promise<UploadImageResult> => {
  if (!env.S3_BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME is not configured')
  }

  // Generate unique filename
  const fileExtension = originalFileName.split('.').pop() || 'jpg'
  const uniqueFileName = `${uuidv4()}.${fileExtension}`
  const key = `${folder}/${uniqueFileName}`

  try {
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
      ACL: 'public-read', // Make the file publicly accessible
    })

    await s3Client.send(command)

    // Construct the public URL
    const url = `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`

    return {
      url,
      key,
      fileName: originalFileName,
      fileSize: file.length,
      mimeType,
    }
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw new Error(`Failed to upload image to S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generates a presigned URL for direct upload from client
 */
export const generatePresignedUploadUrl = async (
  fileName: string,
  mimeType: string,
  folder: string = 'task-proofs'
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> => {
  if (!env.S3_BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME is not configured')
  }

  const fileExtension = fileName.split('.').pop() || 'jpg'
  const uniqueFileName = `${uuidv4()}.${fileExtension}`
  const key = `${folder}/${uniqueFileName}`

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
    ACL: 'public-read',
  })

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
    const publicUrl = `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`

    return {
      uploadUrl,
      key,
      publicUrl,
    }
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validates if S3 is properly configured
 */
export const isS3Configured = (): boolean => {
  return !!(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.S3_BUCKET_NAME)
}
