import { zeroPad } from '@/vanillaTS/zeropad';

export const secondsToText = (ms: number, short = true): string => {
	const s = ms /1000;
	const second = zeroPad(Math.trunc(s % 60));
	const minute = zeroPad(Math.floor(s / 60 % 60));
	const hour = Math.floor(s / 60 / 60 % 24);
	const day = Math.floor(s / 60 / 60 / 24);
	
	return short ?
		`${day}d, ${hour}h, ${minute}m, ${second}s`:
		`${day} day${day===1? '' : 's'}, ${hour} hour${hour===1? '' : 's'}, ${minute} minute${minute==='01'? '' : 's'}, ${second} seconds`;
};