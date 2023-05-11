import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';
import type { TAdsbdb } from '@/types';

export const aircraftModule = defineStore(ModuleName.AIRCRAFT, {

	state: () => ({
		_current_flights: [] as Array<TAdsbdb>,
		init: false,
		metric: false,
	}),

	getters: {
		current_flights: (state): Array<TAdsbdb> => {
			return state._current_flights.sort((a, b) => {
				const callsign_a = a.callsign || 'z';
				const callsign_b = b.callsign || 'z';
				return callsign_a === callsign_b ? a.altitude > b.altitude ? 1 : 0 : callsign_a > callsign_b ? 1: 0;
			});
		},
		number_current_flights (): number {
			return this.current_flights.length;
		},
	},

	actions: {
		set_current_flights (a: Array<TAdsbdb>): void {
			this._current_flights = a;
		},

		set_init (b: boolean): void {
			this.init = b;
		},

		set_metric (b: boolean): void {
			this.metric = b;
		}
	}
	
});
