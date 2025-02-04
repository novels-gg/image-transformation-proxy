FROM oven/bun:alpine

RUN apk add --no-cache \
    vips \
    vips-dev \
    build-base \
    libc6-compat \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    shadow \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

CMD ["bun", "run", "start"]
