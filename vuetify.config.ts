import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
	icons: {
		defaultSet: 'mdi-svg',
	},
	theme: {
		cspNonce: process.env.NONCE_PLACEHOLDER,
		defaultTheme: 'dark',
		themes: {
			dark: {
				colors: {
					primary: '#a7489f',
					success: '#80CBC4',
					secondary: '#37b7ff',
					danger: '#FB8C00',
					serious: '#B71C1C',
					offwhite: '#ffeecb',
					haze: '#c9fce9',
				},
			},
		},
	},
})
