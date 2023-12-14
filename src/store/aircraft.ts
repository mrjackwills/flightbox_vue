import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';
import type { TAdsbdb, TSortBy, u } from '@/types';

export const aircraftModule = defineStore(ModuleName.AIRCRAFT, {

	state: () => ({
		_current_flights: [] as Array<TAdsbdb>,
		init: false,
		metric: false,
		sort_by: undefined as u<TSortBy>,
		sort_asc: true,
	}),

	getters: {
		// no, need to use self.sort_by
		current_flights: (state): Array<TAdsbdb> => {
			if (!state.sort_by) {
				return state._current_flights.sort((a, b) => {
					const callsign_a = a.callsign || 'z';
					const callsign_b = b.callsign || 'z';
					return callsign_a === callsign_b ? a.altitude > b.altitude ? 1 : 0 : callsign_a > callsign_b ? 1 : 0;
				});
			} else {
				if (state.sort_by === 'altitude') {
					return state._current_flights.sort((a, b) => {
						if (state.sort_asc) {
							return a.altitude >= b.altitude ? 1 : -1;
						} else {
							return a.altitude >= b.altitude ? -1 : 1;
						}
					});
				} else if (state.sort_by === 'aircraft') {

					return state._current_flights.sort((a, b) => {
						const aircraft_a =`${a.aircraft.manufacturer} ${a.aircraft.icao_type}`;
						const aircraft_b =`${b.aircraft.manufacturer} ${b.aircraft.icao_type}`;
						if (state.sort_asc) {
							return aircraft_a.toLowerCase() >= aircraft_b.toLowerCase()? 1 : -1;
						} else {
							return aircraft_a.toLowerCase() >=aircraft_b.toLowerCase() ? -1 : 1;
						}
					});
				} else if (state.sort_by === 'owner') {
					return state._current_flights.sort((a, b) => {
						if (state.sort_asc) {
							return a.aircraft.registered_owner.toLowerCase() >= b.aircraft.registered_owner.toLowerCase() ? 1 : -1;
						} else {
							return a.aircraft.registered_owner.toLowerCase() >= b.aircraft.registered_owner.toLowerCase() ? -1 : 1;
						}
					});
				} else {
					return state._current_flights.sort((a, b) => {
						const callsign_a = a.callsign || 'z';
						const callsign_b = b.callsign || 'z';
						if (state.sort_asc) {

							return callsign_a >= callsign_b ? 1 : -1;
						} else {
							return callsign_a >= callsign_b ? -1 : 1;
						}
					});
				}
			}
		},

		// } else if (state.sort_by === 'aircraft') {
		// 	return state._current_flights.sort((a, b) => {
		// 		return a.aircraft.icao_type > b.aircraft.icao_type ? 1 : 0;
		// 		// ) {
		// 		// 	return -1; // Name A should come before Name B
		// 		// }
		// 		// if (a.aircraft.icao_type > b.aircraft.icao_type) {
		// 		// 	return 1; // Name B should come before Name A
		// 		// }
		// 		// return 0; // Names are equal
		// 	});
		// 	// } else if (state.sort_by === 'altitude') {
		// 	// 	return state._current_flights.sort((a, b) => a.aircraft.altitude > b.aircraft.altitude);
		// 	// } else if (state.sort_by === 'owner') {
		// 	// 	return state._current_flights.sort((a, b) => a.aircraft.owner > b.aircraft.owner);
		// }
		// // return state._current_flights.sort((a, b) => a.aircraft.callsign > b.aircraft.callsign);
		// },

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
		},

		set_sort_by (s: u<TSortBy>) {
			this.sort_by = s;
		},

		set_sort_asc (b: boolean) {
			this.sort_asc = b;
		}
	}

});
