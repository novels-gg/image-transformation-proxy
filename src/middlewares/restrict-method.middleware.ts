import type { NextFunction, Request, Response } from 'express'

export type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'

export const restrictMethod = (...methods: RequestMethod[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedMethods = methods.map((method) => method.toUpperCase())

        if (!parsedMethods.includes(req.method)) {
            res.status(405)
                .set('Allow', parsedMethods.join(', '))
                .send('The requested method is not supported')

            return
        }

        next()
    }
}
