import 'vuetify/styles';
import '../sass/variables.scss';

import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { createVuetify } from 'vuetify';

export default createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: { mdi }
	},

	theme: {
		themes: {
			light: {
				colors: {
					primary: '#a7489f',
					success: '#80CBC4',
					secondary: '#37b7ff',
					danger: '#FB8C00',
					serious: '#B71C1C',
					offwhite: '#ffeecb',
					haze: '#c9fce9'
				}
			}
		}
	}
});