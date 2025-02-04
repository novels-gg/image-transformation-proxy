import { z } from 'zod'

export const ParamSchema = z.object({
    height: z.nullable(
        z.coerce
            .number({ message: 'Height must be a valid number' })
            .min(50, { message: 'Height cannot be smaller than 50 pixels' })
            .max(1920, { message: 'Height cannot be greater than 1920 pixels' })
    ),
    width: z.nullable(
        z.coerce
            .number({ message: 'Width must be a valid number' })
            .min(50, { message: 'Width cannot be smaller then 50 pixels' })
            .max(1920, { message: 'Width cannot be greater then 1920 pixels' })
    ),
    quality: z.nullable(
        z.coerce
            .number({ message: 'Quality must be a valid number' })
            .min(50, { message: 'Quality must be between 50 and 100' })
            .max(100, { message: 'Quality must be between 50 and 100' })
    )
})

export type Params = z.infer<typeof ParamSchema>
