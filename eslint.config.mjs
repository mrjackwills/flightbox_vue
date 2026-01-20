import vuetify from 'eslint-config-vuetify'
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	await vuetify({ imports: false }), {
		rules: {
			'@stylistic/indent': [
				'error',
				'tab',
			],
			'@stylistic/no-tabs': ['error', { allowIndentationTabs: true }],
			'@stylistic/quote-props': [
				'error',
				'as-needed',
			],
			'@stylistic/quotes': [
				'error',
				'single',
				{ allowTemplateLiterals: 'always' },
			],
			'@typescript-eslint/consistent-type-definitions': [
				'error',
				'type',
			],
			'@typescript-eslint/unified-signatures': 'off',
			'no-console': 'error',
			'vue/html-indent': [
				'error',
				'tab',
				{
					attribute: 1,
					closeBracket: 0,
					alignAttributesVertically: true,
					ignores: [],
				},
			],
			'vue/html-quotes': [
				'error',
				'single',
			],
			'vue/script-indent': ['off'],
		},
	},
)
