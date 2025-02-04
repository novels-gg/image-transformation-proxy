import { ParamSchema, type Params } from '@/schema'

export const validateParams = (params: Record<string, unknown>): Params | false => {
    const data = {
        height: params.height ?? null,
        width: params.width ?? null,
        quality: params.quality ?? null
    }

    try {
        const { height, quality, width } = ParamSchema.parse(data)

        return {
            height: height ?? null,
            width: width ?? null,
            quality: quality ?? 85
        }
    } catch (error) {
        return false
    }
}

export const paramObjectToString = (params: Record<string, unknown>) => {
    return Object.entries(params)
        .map(([key, value]) =>
            (typeof value === 'string' || typeof value === 'number') && value
                ? `${key}=${value}`
                : undefined
        )
        .filter((value) => !!value)
        .join('&')
}
