import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    experimental: {
      async: true
    }
  },
  kit: {
    adapter: adapter({
      platformProxy: {
        configPath: 'wrangler.jsonc',
        persist: true
      }
    }),
    experimental: {
      remoteFunctions: true
    }
  },
  preprocess: vitePreprocess(),
  vitePlugin: {
    inspector: true
  }
};

export default config;
