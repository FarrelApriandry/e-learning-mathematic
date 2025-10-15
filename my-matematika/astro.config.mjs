// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import react from "@astrojs/react";
// import fs from "@astrojs/fs";
// import react from '@astrojs/react';
// import jsonImportAssertions from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind(),
        react(),
    ],
    output: 'server',
    adapter: vercel({}),
    // experimental: {
    //     jsonImportAssertions: true,
    // },
});