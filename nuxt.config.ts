import { headerDescription, headerTitle, headerUrl } from './app/utils/header'

const npm_version = JSON.stringify(process.env.npm_package_version)
if (!npm_version || npm_version.trim() === '') {
	throw new Error('package.json.version is missing')
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

	compatibilityDate: '2025-07-15',

	typescript: { strict: true, shim: true },

	devtools: { enabled: true },

	components: true,

	modules: [
		'@nuxt/eslint',
		'@nuxtjs/sitemap',
		'@pinia/nuxt',
		'@vite-pwa/nuxt',
		'vuetify-nuxt-module',
		'unplugin-fonts/nuxt',
	],

	ssr: true,

	site: {
		url: headerUrl,
	},

	// when enabling ssr option you need to disable inlineStyles and maybe devLogs
	features: {
		inlineStyles: true,
		devLogs: false,
	},

	build: {
		transpile: ['vuetify'],

	},

	vite: {
		define: {
			'process.env': {},
			'import.meta.env.BUILD_DATE': Date.now(),
			'import.meta.env.VERSION': npm_version,
			// Debug only
			// __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
		},

		ssr: {
			noExternal: ['vuetify'],
		},
	},

	nitro: {

		hooks: {
			'prerender:generate' (route) {
				const routesToSkip = ['/200.html']
				if (routesToSkip.includes(route.route)) {
					route.skip = true
				}
			},
		},
	},

	devServer: {
		port: 8002,
	},

	pwa: {
		registerType: 'autoUpdate',
		includeAssets: ['favicon.ico'],
		filename: 'sw_01.js',

		manifest: {
			display: 'standalone',
			name: headerTitle,
			description: headerDescription,
			short_name: headerTitle,
			theme_color: '#a7489f',
			background_color: '#212121',
			id: '/?1',
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
			],
			categories: [
				'utilities',
			],
			screenshots: [
				{
					src: 'img/screenshots/narrow_01.png',
					type: 'image/png',
					sizes: '437x720',
					form_factor: 'narrow',
				},
				{
					src: 'img/screenshots/wide_01.png',
					type: 'image/png',
					sizes: '720X503',
					form_factor: 'wide',
				},
			],

		},
		injectManifest: {
			globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
		},
		workbox: {
			clientsClaim: true,
			globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
			cleanupOutdatedCaches: true,
			navigateFallbackDenylist: [
				/^\/.*$/,
			],
		},
		client: {
			installPrompt: true,
			periodicSyncForUpdates: 3600,
		},
		devOptions: {
			enabled: true,
			suppressWarnings: true,
			navigateFallback: '/',
			navigateFallbackAllowlist: [/^\/$/],
			type: 'module',
		},
	},

	vuetify: {
		moduleOptions: {
			// check https://nuxt.vuetifyjs.com/guide/server-side-rendering.html
			ssrClientHints: {
				reloadOnFirstRequest: false,
				viewportSize: true,
				prefersColorScheme: false,

				prefersColorSchemeOptions: {
					useBrowserThemeOnly: false,
				},
			},

			// /* If customizing sass global variables ($utilities, $reset, $color-pack, $body-font-family, etc) */
			// disableVuetifyStyles: true,
			styles: {
				configFile: 'assets/settings.scss',
			},
		},
	},

	unfonts: {
		/* options */
		custom: {
			families: [
				{
					name: 'Baloo 2',
					local: 'Baloo 2',
					src: './public/fonts/*.woff2',
				},
			],
			display: 'auto',
		},
	},

	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			link: [
				{
					rel: 'stylesheet',
					href: '/index.css',
					nonce: process.env.NONCE_PLACEHOLDER,
				},
				{
					rel: 'manifest',
					href: 'manifest.webmanifest',
				},
			],
			meta: [
				{
					name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover',
				},
			],
			style: [{
				// This is mainly due to Firefox rendering slowness
				innerHTML:
					`html, body {background-color: #cfcfcf!important;}
@supports (-moz-appearance: none) {@media (max-width: 1200px) {.firefox-css-fix {display: none!important;}}}`,
				nonce: process.env.NONCE_PLACEHOLDER,
			},
			],

		},
	},
})
