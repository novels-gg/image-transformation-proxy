import { access, mkdir } from 'fs/promises'
import { join } from 'path'

const STORAGE_PATH = join(process.cwd(), 'storage')
export const ASSETS_PATH = join(STORAGE_PATH, 'assets', 'images')
export const TRANSFORMATIONS_PATH = join(STORAGE_PATH, 'transformations', 'objects')

export const ensureDirectoryExists = async (path: string) => {
    try {
        await access(path)
    } catch {
        await mkdir(path, { recursive: true })
    }
}
