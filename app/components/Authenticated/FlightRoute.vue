<template>
	<v-row class='ma-0 pa-0 bg-black align-center justify-start' density='compact'>

		<v-col
			v-for='(item, index) in flightrouteRow'
			:key='index'
			class='ma-0 pa-0  grey-darken-2 align-center'
			:class='{ "small-text": mobile, }'
			cols='12'
		>
			<v-row class='ma-0 pa-0 pl-2 align-center justify-start' :class='`text-${color(index)}`' density='compact'>

				<v-col class='ma-0 pa-0 align-center' cols='4' sm='2'>

					<v-row class='ma-0 pa-0 align-center justify-start' density='compact'>
						<v-col class='ma-0 pa-0 mr-1' cols='auto'>
							<v-icon
								:color='color(index)'
								:icon='index === 0 ? mdiAirplaneTakeoff : mdiAirplaneLanding'
								size='x-small'
							/>
						</v-col>

						<v-col class='ma-0 pa-0 mr-1' cols='auto'>
							<span class='mono-numbers'>{{ item.icao }} </span>
						</v-col>

						<v-col class='ma-0 pa-0' cols='auto'>
							<span v-if='item.iata' class='mono-numbers'>( {{ item.iata }} )</span>
						</v-col>

					</v-row>

				</v-col>

				<v-col class='align-center ma-0 pa-0 font-weight-bold' md='auto'>
					<a :href='mapHref(index)' rel='noopener noreferrer' target='_blank'>
						<v-icon :color='color(index)' :icon='mdiMapSearch' size='x-small' />
					</a>
					{{ item.name }}, {{ item.municipality }}, {{ item.country_name }}
				</v-col>

			</v-row>
			<v-row v-if='index === 0' class='ma-0 pa-0 mt-1 justify-start' density='compact'>
				<v-col class='ma-0 pa-0 divider' cols='12' />
			</v-row>
		</v-col>

	</v-row>
</template>

<script setup lang="ts">
import type { TFlightRoute, TFlightRouteRow } from '@/types'
import { mdiAirplaneLanding, mdiAirplaneTakeoff, mdiMapSearch } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const flightrouteRow = computed((): Array<TFlightRouteRow> => [
	{
		icao: props.flightroute.origin.icao_code,
		iata: props.flightroute.origin.iata_code,
		name: props.flightroute.origin.name,
		country_name: props.flightroute.origin.country_name,
		municipality: props.flightroute.origin.municipality,
	},
	{
		icao: props.flightroute.destination.icao_code,
		iata: props.flightroute.destination.iata_code,
		name: props.flightroute.destination.name,
		country_name: props.flightroute.destination.country_name,
		municipality: props.flightroute.destination.municipality,
	},
])

const color = (index: number): string => index ? 'secondary' : 'primary'
function mapHref (index: number): string {
	const query = index ? `${props.flightroute.destination.latitude},${props.flightroute.destination.longitude}` : `${props.flightroute.origin.latitude},${props.flightroute.origin.longitude}`
	return `https://www.google.com/maps/place/@${query},14z/`
}

const props = defineProps<{
	flightroute: TFlightRoute
	flIndex: number
}>()
</script>

<style scoped>
.divider {
    border-top: 1px solid rgba(255, 255, 255, .35)
}
</style>
