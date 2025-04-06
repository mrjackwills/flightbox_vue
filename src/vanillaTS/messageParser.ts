import { isString } from '@/types/typeguard';
import { parse } from 'secure-json-parse';
import type { TWSFromFlightBox } from '@/types';

export const parseMessage = (message: unknown): TWSFromFlightBox | undefined => {
	try {
		if (!isString(message)) throw Error('not string');
		const tmpData: TWSFromFlightBox = parse(message, undefined, {
			protoAction: 'remove',
			constructorAction: 'remove'
		});
		if (!tmpData.data && !tmpData?.error) throw Error('Invalid data');
		return tmpData;
	} catch {
		return undefined;
	}
};