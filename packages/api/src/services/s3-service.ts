import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import env from '@/env'
import { v4 as uuidv4 } from 'uuid'

// Initialize S3 client
// In Lambda, AWS credentials are automatically provided via IAM role
// No need to explicitly set credentials - AWS SDK will use the execution role
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'sa-east-1',
})

export interface UploadFileResult {
  url: string
  key: string
  fileName: string
  fileSize: number
  mimeType: string
}

/**
 * Uploads a file to S3 and returns the URL and metadata
 */
export const uploadFileToS3 = async (
  file: Buffer,
  originalFileName: string,
  mimeType: string,
  folderPath: string
): Promise<UploadFileResult> => {
  if (!env.ASSETS_BUCKET_NAME) {
    throw new Error('ASSETS_BUCKET_NAME is not configured')
  }

  // Generate unique filename
  const fileExtension = originalFileName.split('.').pop() || 'jpg'
  const uniqueFileName = `${uuidv4()}.${fileExtension}`
  const key = `${folderPath}/${uniqueFileName}`

  try {
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: env.ASSETS_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
    })

    await s3Client.send(command)

    // Construct the public URL
    const region = process.env.AWS_REGION || 'sa-east-1'
    const url = `https://${env.ASSETS_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`

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
  folderPath: string
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> => {
  if (!env.ASSETS_BUCKET_NAME) {
    throw new Error('ASSETS_BUCKET_NAME is not configured')
  }

  const fileExtension = fileName.split('.').pop() || 'jpg'
  const uniqueFileName = `${uuidv4()}.${fileExtension}`
  const key = `${folderPath}/${uniqueFileName}`

  const command = new PutObjectCommand({
    Bucket: env.ASSETS_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
    // ACL removed - modern S3 buckets don't allow ACLs by default
  })

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
    const region = process.env.AWS_REGION || 'sa-east-1'
    const publicUrl = `https://${env.ASSETS_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`

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
 * Validates if S3 is properly configured and accessible
 */
export const isS3Configured = async (): Promise<boolean> => {
  try {
    if (!env.ASSETS_BUCKET_NAME) {
      console.error('ASSETS_BUCKET_NAME is not configured')
      return false
    }

    // Try to list objects in the bucket to verify access
    const { ListObjectsV2Command } = await import('@aws-sdk/client-s3')
    const command = new ListObjectsV2Command({
      Bucket: env.ASSETS_BUCKET_NAME,
      MaxKeys: 1, // Just check if we can access the bucket
    })

    await s3Client.send(command)
    console.log('S3 bucket is accessible:', env.ASSETS_BUCKET_NAME)
    return true
  } catch (error) {
    console.error('S3 configuration validation failed:', error)
    return false
  }
}
