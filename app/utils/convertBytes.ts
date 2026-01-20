import type { TConvertBytes } from '../types'

export function convert_bytes (x: number | string): TConvertBytes {
	if (Number.isNaN(x)) {
		throw new TypeError('convert_bytes invalid input')
	}
	const i = Number(x)
	const gb = i / 1000 / 1000 / 1000
	const mb = i / 1000 / 1000

	if (gb >= 1) {
		return {
			total: `${Number(i / 1000 / 1000 / 1000).toFixed(2)}`,
			unit: `GB`,
		}
	} else if (mb >= 100) {
		return {
			total: `${Math.trunc(i / 1000 / 1000)}`,
			unit: `MB`,
		}
	} else if (mb >= 1) {
		return {
			total: `${Number(i / 1000 / 1000).toFixed(2)}`,
			unit: `MB`,
		}
	} else {
		return {
			total: `${Math.trunc(i / 1000)}`,
			unit: `kB`,
		}
	}
}
