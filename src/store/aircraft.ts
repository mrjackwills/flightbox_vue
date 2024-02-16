import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';
import type { TAdsbdb, TSortBy, u } from '@/types';

export const aircraftModule = defineStore(ModuleName.AIRCRAFT, {

	state: () => ({
		_current_flights: [] as Array<TAdsbdb>,
		unsorted_flights: [] as Array<TAdsbdb>,
		init: false,
		metric: false,
		sort_by: undefined as u<TSortBy>,
		sort_asc: true,
	}),

	getters: {
		
		current_flights: (state): Array<TAdsbdb> => {
			return state._current_flights;
		},
		// 	if (!state.sort_by) {
		// 		return state._current_flights.sort((a, b) => {
		// 			const callsign_a = a.callsign || 'z';
		// 			const callsign_b = b.callsign || 'z';
		// 			return callsign_a === callsign_b ? a.altitude > b.altitude ? 1 : 0 : callsign_a > callsign_b ? 1 : 0;
		// 		});
		// 	} else {
		// 		if (state.sort_by === 'altitude') {
		// 			return state._current_flights.sort((a, b) => {
		// 				if (state.sort_asc) {
		// 					return a.altitude >= b.altitude ? 1 : -1;
		// 				} else {
		// 					return a.altitude >= b.altitude ? -1 : 1;
		// 				}
		// 			});
		// 		} else if (state.sort_by === 'aircraft') {

		// 			return state._current_flights.sort((a, b) => {
		// 				const aircraft_a =`${a.aircraft.manufacturer} ${a.aircraft.icao_type}`;
		// 				const aircraft_b =`${b.aircraft.manufacturer} ${b.aircraft.icao_type}`;
		// 				if (state.sort_asc) {
		// 					return aircraft_a.toLowerCase() >= aircraft_b.toLowerCase()? 1 : -1;
		// 				} else {
		// 					return aircraft_a.toLowerCase() >=aircraft_b.toLowerCase() ? -1 : 1;
		// 				}
		// 			});
		// 		} else if (state.sort_by === 'owner') {
		// 			return state._current_flights.sort((a, b) => {
		// 				if (state.sort_asc) {
		// 					return a.aircraft.registered_owner.toLowerCase() >= b.aircraft.registered_owner.toLowerCase() ? 1 : -1;
		// 				} else {
		// 					return a.aircraft.registered_owner.toLowerCase() >= b.aircraft.registered_owner.toLowerCase() ? -1 : 1;
		// 				}
		// 			});
		// 		} else {
		// 			return state._current_flights.sort((a, b) => {
		// 				const callsign_a = a.callsign || 'z';
		// 				const callsign_b = b.callsign || 'z';
		// 				if (state.sort_asc) {
		// 					return callsign_a >= callsign_b ? 1 : -1;
		// 				} else {
		// 					return callsign_a >= callsign_b ? -1 : 1;
		// 				}
		// 			});
		// 		}
		// 	}
		// },

		number_current_flights (): number {
			return this.current_flights.length;
		},
	},

	actions: {
		set_current_flights (a: Array<TAdsbdb>): void {
			this._current_flights = a;
			this.unsorted_flights = [ ...a ];
		},

		set_init (b: boolean): void {
			this.init = b;
		},

		set_metric (b: boolean): void {
			this.metric = b;
		},

		set_sort_by (s: u<TSortBy>) {
			// if (!s) {
			// 	this._current_flights.sort((a, b) => {
			// 		const callsign_a = a.callsign || 'z';
			// 		const callsign_b = b.callsign || 'z';
			// 		return callsign_a === callsign_b ? a.altitude > b.altitude ? 1 : 0 : callsign_a > callsign_b ? 1 : 0;
			// 	});
			// } else {
			// 	if (s === 'altitude') {
			// 		const copy = [ ... this._current_flights ];
			// 		copy.sort((a, b) => {
			// 			if (this.sort_asc) {
			// 				return a.altitude >= b.altitude ? 1 : -1;
			// 			} else {
			// 				return a.altitude >= b.altitude ? -1 : 1;
			// 			}
			// 		});
			// 		this._current_flights = copy;
			// 	}
			// }
			this.sort_by = s;
		},

		set_sort_asc (b: boolean) {
			this.sort_asc = b;
		},

		reset_sort () {
			this.sort_by = undefined;
			this.sort_asc = true;
			this._current_flights = [ ...this.unsorted_flights ];
		}
	}

});
