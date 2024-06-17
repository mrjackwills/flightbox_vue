// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import type { VitePWAOptions } from 'vite-plugin-pwa';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

// vite.config.js

// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const pwaOptions: Partial<VitePWAOptions> = {
	base: '/',
	registerType: 'prompt',
	includeAssets: [ 'favicon.ico' ],
	workbox: {
		cleanupOutdatedCaches: true
	},
	manifest: {
		display: 'standalone',
		name: 'flightbox',
		description: 'flightbox pwa',
		short_name: 'flightbox',
		theme_color: '#a7489f',
		background_color: '#000000',
		icons: [
			{
				src: 'img/icons/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: 'img/icons/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: 'img/icons/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any maskable'
			},
		],
	},
	// devOptions: {
	// 	enabled: true,
	// 	/* when using generateSW the PWA plugin will switch to classic */
	// 	type: 'module',
	// 	navigateFallback: 'index.html',
	// },
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({
			template: { transformAssetUrls }
		}),
		// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
		vuetify({
			autoImport: true,
		}),
		Components(),
		AutoImport({
			include: [
				/\.[tj]sx?$/,
				/\.vue$/, /\.vue\?vue/,
				/\.md$/,
			],
			imports: [
				'vue',
				'vue-router',

			],
			dts: 'src/auto-imports.d.ts',
			eslintrc: {
				enabled: true,
			},
			dirs: [
				'src/store',
			],
			vueTemplate: false,
		}),
		VitePWA(pwaOptions),
		viteCompression({ algorithm: 'brotliCompress', filter: /\.(js|mjs|json|css)$/i }),
		viteCompression({ algorithm: 'gzip', filter: /\.(js|mjs|json|css)$/i }),
	],
	define: {
		'process.env': {},
		'import.meta.env.BUILD_DATE': Date.now(),
		'import.meta.env.VERSION': JSON.stringify(process.env.npm_package_version),
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
		extensions: [ '.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue' ],
	},
	server: {
		port: 8002,
		host: '127.0.0.1'
	},
});
