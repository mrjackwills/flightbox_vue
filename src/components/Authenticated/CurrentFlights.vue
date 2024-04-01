<template>
	<section>
		<div v-if='init'>
			<v-expand-transition>
				<section v-if='number_current_flights' class='black--text'>

					<v-row class='ma-0 pa-0 text-left headers pa-2 bg-primary' justify='space-between' align='center'>
						<v-col cols='3' class='ma-0 pa-0' v-for='(item, index) in headers' :key='index'
							:class='{ "text-right": index > 1 }'>
							<v-row class='ma-0 pa-0' align='center' justify='start'>
								<v-col cols='12' class='ma-0 pa-0'>
									<span class='font-weight-bold text-uppercase unselectable text-grey-lighten-3'>{{
										item.name }}</span>
									<v-icon :icon='get_icon(item.sort_by)' size='x-small' class='ml-3'
										@click='sort_click(item.sort_by)' />
								</v-col>
							</v-row>
						</v-col>

					</v-row>

					<v-row class='ma-0 pa-0 text-left' justify='space-between' align='center'>

						<v-col cols='12' class='ma-0 pa-0'>
							<section v-for='(flight, index) in local_current_flights' :key='flight.aircraft.mode_s'>
								<AircraftRow :flight='flight' :showDivider='index !== number_current_flights - 1'
									:index='index' />
							</section>
						</v-col>
					</v-row>

				</section>

			</v-expand-transition>
			<v-row class='ma-0 pa-0' align='center' justify='center' v-if='!number_current_flights'>
				<v-col cols='auto' class='ma-0 pa-0 text-h6 unselectable'>
					no flights overhead
				</v-col>
			</v-row>
		</div>
		<v-row justify='center' align='center' class='minh' v-else>
			<v-col cols='auto' class='ma-0 pa-0 my-6'>
				<v-progress-circular indeterminate color='primary' />
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang="ts">

import type { TAdsbdb, TSortBy, u } from '@/types';
import { mdiArrowDownThick, mdiArrowUpThick, mdiSort } from '@mdi/js';
const aircraftStore = aircraftModule();

const local_current_flights = ref([] as Array<TAdsbdb>);

const current_flights = computed((): Array<TAdsbdb> => {
	return aircraftStore.current_flights;
});

onMounted(() => {
	local_current_flights.value = [ ...current_flights.value ];
	sort_local();
});

const init = computed((): boolean => {
	return aircraftStore.init;
});
const number_current_flights = computed((): number => {
	return current_flights.value.length;
});

const get_icon = (x: TSortBy): string => {
	if (sort_by.value === x) {
		if (sort_asc.value) return mdiArrowDownThick;
		else return mdiArrowUpThick;
	}
	return mdiSort;
};

const sort_click = (x: TSortBy): void => {
	if (!sort_by.value || sort_by.value !== x) {
		sort_by.value = x;
	} else if (sort_asc.value) {
		sort_asc.value = !sort_asc.value;
	} else if (!sort_asc.value) {
		aircraftStore.reset_sort();
	}
};

const sort_by = computed({
	get (): u<TSortBy> {
		return aircraftStore.sort_by;
	},
	set (b: u<TSortBy>): void {
		// return;
		aircraftStore.set_sort_by(b);
	}
});

const sort_asc = computed({
	get (): boolean {
		return aircraftStore.sort_asc;
	},
	set (b: boolean): void {
		aircraftStore.set_sort_asc(b);
	}
});

const headers = [
	{
		name: 'callsign',
		sort_by: 'callsign' as TSortBy,
	},
	{
		name: 'aircraft (mode_s)',
		sort_by: 'aircraft' as TSortBy,
	},
	{
		name: 'owner',
		sort_by: 'owner' as TSortBy,
	},
	{
		name: 'altitude',
		sort_by: 'altitude' as TSortBy,
	},

];

const sort_local = (): void => {
	if (!sort_by.value) {
		local_current_flights.value.sort((a, b) => {
			const callsign_a = a.callsign || 'z';
			const callsign_b = b.callsign || 'z';
			return callsign_a === callsign_b ? a.altitude > b.altitude ? 1 : 0 : callsign_a > callsign_b ? 1 : 0;
		});
	} else {
		if (sort_by.value === 'altitude') {
			local_current_flights.value.sort((a, b) => {
				if (sort_asc.value) {
					return a.altitude >= b.altitude ? 1 : -1;
				} else {
					return a.altitude >= b.altitude ? -1 : 1;
				}
			});
		} else if (sort_by.value === 'aircraft') {
			local_current_flights.value.sort((a, b) => {
				const aircraft_a =`${a.aircraft.manufacturer} ${a.aircraft.icao_type}`;
				const aircraft_b =`${b.aircraft.manufacturer} ${b.aircraft.icao_type}`;
				if (sort_asc.value) {
					return aircraft_a.toLowerCase() >= aircraft_b.toLowerCase()? 1 : -1;
				} else {
					return aircraft_a.toLowerCase() >=aircraft_b.toLowerCase() ? -1 : 1;
				}
			});
		} else if (sort_by.value === 'owner') {
			local_current_flights.value.sort((a, b) => {
				if (sort_asc.value) {
					return a.aircraft.registered_owner.toLowerCase() >= b.aircraft.registered_owner.toLowerCase() ? 1 : -1;
				} else {
					return a.aircraft.registered_owner.toLowerCase() >= b.aircraft.registered_owner.toLowerCase() ? -1 : 1;
				}
			});
		} else {
			local_current_flights.value.sort((a, b) => {
				const callsign_a = a.callsign || 'z';
				const callsign_b = b.callsign || 'z';
				if (sort_asc.value) {
					return callsign_a >= callsign_b ? 1 : -1;
				} else {
					return callsign_a >= callsign_b ? -1 : 1;
				}
			});
		}
	}
};

watch(sort_asc, (_) => {
	// handle the sort in here
	sort_local();
});
watch(sort_by, (_) => {
	// handle the sort in here
	sort_local();
});

watch(current_flights, (i) => {
	// handle the sort in here
	local_current_flights.value = [ ...i ];
	sort_local();
});

</script>

<style>
.headers {
	border-top-right-radius: .35rem;
	border-top-left-radius: .35rem;
}</style>
