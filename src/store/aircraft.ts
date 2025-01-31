import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';
import type { TAdsbdb, TSortBy, u } from '@/types';

export const aircraftModule = defineStore(ModuleName.AIRCRAFT, {

	state: () => ({
		all_expanded: false,
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

		number_current_flights (): number {
			return this.current_flights.length;
		},
	},

	actions: {
		set_all_expanded (b: boolean): void {
			this.all_expanded = b;
		},

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
