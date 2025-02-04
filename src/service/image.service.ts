import type { Params } from '@/schema'
import { access, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { ASSETS_PATH, TRANSFORMATIONS_PATH, ensureDirectoryExists } from '../utils/filesystem'

export class ImageService {
    private readonly imageFormat = 'webp'

    async exists(path: string) {
        try {
            await access(path)
            return true
        } catch {
            return false
        }
    }

    async transformImage(inputPath: string, outputPath: string, params: Params): Promise<void> {
        const image = sharp(await readFile(inputPath))

        // Configure transformation
        image
            .resize({
                width: params.width ?? undefined,
                height: params.height ?? undefined,
                fit: 'cover'
            })
            .webp({
                quality: params.quality ?? 85
            })

        // Ensure output directory exists
        await ensureDirectoryExists(TRANSFORMATIONS_PATH)

        // Save transformed image
        await writeFile(outputPath, await image.toBuffer())
    }

    getTransformedImagePath(objectId: string): string {
        return join(TRANSFORMATIONS_PATH, `${objectId}.${this.imageFormat}`)
    }

    getOriginalImagePath(pathname: string): string {
        return join(ASSETS_PATH, pathname)
    }
}
