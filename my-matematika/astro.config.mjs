// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import preact from '@astrojs/preact';
// import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind(),
        preact(),
    ],
    output: 'server',
    adapter: vercel({}),
    // experimental: {
    //     serverIslands: true,
    // },
    // integrations: [react()],
});