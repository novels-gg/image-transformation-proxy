import cors from 'cors'
import Express from 'express'
import { restrictMethod } from './middlewares'
import { ImageService } from './service'
import {
    ensureDirectoryExists,
    hash,
    paramObjectToString,
    TRANSFORMATIONS_PATH,
    validateParams
} from './utils'

const app = Express()
const imageService = new ImageService()

await ensureDirectoryExists(TRANSFORMATIONS_PATH)

app.use(cors({ origin: '*' }))
app.use(restrictMethod('GET'))

app.get('*', async (req, res) => {
    const pathname = req.path.slice(1) // Remove the leading slash

    // Only allow requests with two or path segments which end with a valid image extension,
    // also prohibit requests to already optimized objects
    const REGEXP = /^(?!objects\/)[a-zA-Z0-9_-]+\/[a-zA-Z0-9_\/-]+\.(png|jpe?g|webp|avif)$/

    if (pathname.length > 255 || !REGEXP.test(pathname)) {
        res.status(404).send('The requested resource does not exist')

        return
    }

    const parameters = validateParams(req.query)

    if (!parameters) {
        res.status(422).send('Invalid transformation parameters provided')

        return
    }

    try {
        // Generate a unique object ID based on requested object and transformation
        // parameters, remember that since we're hashing the value, we'll get the
        // same object ID for any unique transformation
        const objectId = hash(pathname + paramObjectToString(parameters))

        const transformedPath = imageService.getTransformedImagePath(objectId)

        // Check whether the transformed object for requested resource already
        // exist in the transformed objects directory or not and if it exists
        // then return it with appropriate headers
        if (await imageService.exists(transformedPath)) {
            res.setHeader('Content-Type', 'image/webp')
                .setHeader('Cache-Control', 'no-store')
                .sendFile(transformedPath)

            return
        }

        const originalPath = imageService.getOriginalImagePath(pathname)

        // Make sure the requested object do exist in assets directory
        // and if it doesn't exists then return a 404 response
        if (!(await imageService.exists(originalPath))) {
            res.status(404)
                .setHeader('Cache-Control', 'no-store')
                .send('The requested resource does not exist')

            return
        }

        // Transform the source image and save it to local storage
        await imageService.transformImage(originalPath, transformedPath, parameters)

        res.setHeader('Content-Type', 'image/webp')
            .setHeader('Cache-Control', 'no-store')
            .sendFile(transformedPath)
    } catch (error) {
        console.error('Error processing image:', error)

        res.status(500)
            .setHeader('Cache-Control', 'no-store')
            .send('An error occurred while processing request')
    }
})

app.listen(3000, '0.0.0.0', () => {
    console.log('The server is listening to connections in port 3000')
})
