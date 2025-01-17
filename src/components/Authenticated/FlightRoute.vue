<template>
	<v-row class='ma-0 pa-0 flightroutebox bg-black' align='center' justify='center'>

		<v-col v-for='(item, index) in flightrouteRow' :key='index' class='ma-0 pa-0 grey-darken-2' cols='12' xl='10'  :class='{"small-text": mobile, "pt-1" : index}' >
			<v-row class='ma-0 pa-0 pl-2' justify='start' :class='`text-${color(index)}`' align='center'>

				<v-col cols='4' sm='2' class='ma-0 pa-0'>

					<v-row class='ma-0 pa-0'  justify='start' align='center' >
						<v-col cols='auto' class='ma-0 pa-0 mr-1'>
							<v-icon
								size='x-small'
								:color='color(index)' :icon='index === 0 ? mdiAirplaneTakeoff : mdiAirplaneLanding' />
						</v-col>

						<v-col cols='auto' class='ma-0 pa-0 mr-1'>
							<span class='mono-numbers'>{{ item.icao }} </span>
						</v-col>

						<v-col cols='auto' class='ma-0 pa-0'>
							<span class='mono-numbers' v-if='item.iata'>( {{ item.iata }} )</span>
						</v-col>

					</v-row>

				</v-col>

				<v-col md='auto'  class='ma-0 pa-0 font-weight-bold'>
					<a :href='mapHref(index)' target='_blank' rel='noopener noreferrer'>
						<v-icon size='x-small' :color='color(index)' :icon='mdiMapSearch'/>
					</a>
					{{ item.name }}, {{ item.municipality }}, {{ item.country_name }}
				</v-col>

			</v-row>
			<v-row class='ma-0 pa-0' v-if='index === 0' justify='start'>

				<v-col cols='12' class='ma-0 pa-0 divider' />
			</v-row>
		</v-col>

	</v-row>
</template>

<script setup lang="ts">
import { mdiAirplaneLanding, mdiAirplaneTakeoff, mdiMapSearch } from '@mdi/js';
import type { TFlightRoute, TFlightRouteRow } from '@/types';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
	
const flightrouteRow = computed((): Array<TFlightRouteRow> => {
	return [
		{
			icao: props.flightroute.origin.icao_code,
			iata: props.flightroute.origin.iata_code,
			name: props.flightroute.origin.name,
			country_name: props.flightroute.origin.country_name,
			municipality: props.flightroute.origin.municipality
		},
		{
			icao: props.flightroute.destination.icao_code,
			iata: props.flightroute.destination.iata_code,
			name: props.flightroute.destination.name,
			country_name: props.flightroute.destination.country_name,
			municipality: props.flightroute.destination.municipality
		}
	];
});

const color = (index: number) : string => {
	return index ? 'secondary' : 'primary';
};
const mapHref = (index: number): string => {
	const query = index ? `${props.flightroute.destination.latitude},${props.flightroute.destination.longitude}` : `${props.flightroute.origin.latitude},${props.flightroute.origin.longitude}`;
	return `https://www.google.com/maps/place/@${query},14z/`;
};

const props = defineProps<{flightroute: TFlightRoute, fl_index: number}>();
</script>

<style scoped>

.divider{
	border-top: 1px solid rgba(255,255,255,.35)
}
</style>