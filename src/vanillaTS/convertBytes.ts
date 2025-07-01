import type { TConvertBytes } from '../types';

export const convert_bytes = (x: number | string): TConvertBytes => {
	if (isNaN(Number(x))) throw Error('convert_bytes invalid input');
	const i = Number(x);
	const gb = i / 1000 / 1000 / 1000;
	const mb = i / 1000 / 1000;
	return gb >= 1
		? {
			total: `${Number(i / 1000 / 1000 / 1000).toFixed(2)}`,
			unit: `GB`
		}
		: mb >= 100
			? {
				total: `${Math.trunc(i / 1000 / 1000)}`,
				unit: `MB`
			}
			: mb >= 1
				? {
					total: `${Number(i / 1000 / 1000).toFixed(2)}`,
					unit: `MB`
				}
				: {
					total: `${Math.trunc(i / 1000)}`,
					unit: `kB`
				};
};
