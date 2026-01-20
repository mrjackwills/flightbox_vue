import { readFile, writeFile } from 'node:fs/promises'
import * as cheerio from 'cheerio'
import { glob } from 'glob'

const nonce_placeholder = process.env.NONCE_PLACEHOLDER
if (!nonce_placeholder || nonce_placeholder.trim() === '') {
	throw new Error('env.NONCE_PLACEHOLDER is missing')
}
const outDir = '.output'

export default defineNitroPlugin(async nitro => {
	nitro.hooks.hook('close', async () => {
		const htmlFiles = await glob('**/*.html', { cwd: outDir, absolute: true })

		await Promise.all(
			htmlFiles.map(async file => {
				const original = await readFile(file, 'utf8')
				const $ = cheerio.load(original)

				$('script:not([nonce]):not([type="application/ld+json"])')
					.attr('nonce', nonce_placeholder)
				$('link[as="script"]:not([nonce])')
					.attr('nonce', nonce_placeholder)

				const updated = $.html()
				if (updated !== original) {
					await writeFile(file, updated)
				}
			}),
		)
	})
})
