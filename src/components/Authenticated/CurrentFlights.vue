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
							<section v-for='(flight, index) in current_flights' :key='flight.aircraft.mode_s'>
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

const current_flights = computed((): Array<TAdsbdb> => {
	return aircraftStore.current_flights;
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

</script>

<style>
.headers {
	border-top-right-radius: .35rem;
	border-top-left-radius: .35rem;
}</style>
