import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { AppError } from './errors';

const UPLOAD_PATH = 'uploads';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageSizes {
  thumbnail: { width: number; height: number };
  medium: { width: number; height: number };
  large: { width: number; height: number };
}

const imageSizes: ImageSizes = {
  thumbnail: { width: 150, height: 150 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 }
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      cb(new AppError('Invalid file type. Only JPEG, PNG and WebP are allowed', 400));
      return;
    }
    cb(null, true);
  }
});

export const processImage = async (
  file: Express.Multer.File,
  sizes: (keyof ImageSizes)[] = ['thumbnail', 'medium', 'large']
): Promise<string[]> => {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const urls: string[] = [];

  await fs.mkdir(path.join(UPLOAD_PATH), { recursive: true });

  for (const size of sizes) {
    const { width, height } = imageSizes[size];
    const outputFilename = `${filename}-${size}.webp`;
    const outputPath = path.join(UPLOAD_PATH, outputFilename);

    await sharp(file.buffer)
      .resize(width, height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    urls.push(`/uploads/${outputFilename}`);
  }

  return urls;
};

export const deleteImage = async (url: string): Promise<void> => {
  try {
    const filepath = path.join(process.cwd(), url);
    await fs.unlink(filepath);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};