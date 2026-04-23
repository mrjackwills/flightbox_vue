<template>
	<section>
		<div v-if='init'>
			<v-expand-transition>
				<section v-if='number_current_flights'>
					<!-- Pre-load images -->
					<template
						v-for='item in imageCache'
						:key='item'
					>
						<v-img
							v-show='false'
							alt='cached thumbnail photo'
							eager
							:src='`${item}`'
						/>
					</template>

					<v-row class='ma-0 pa-0 text-left headers pa-1 bg-primary align-center justify-space-between'>

						<v-col
							v-for='(item, index) in headers'
							:key='index'
							class='ma-0 pa-0'
							:class='{ "text-right": index > 1 }'
							cols='3'
						>
							<v-row class='ma-0 pa-0 align-center justify-start'>
								<v-col class='ma-0 pa-0' cols='12'>
									<span
										class='font-weight-bold text-uppercase text-body-2 unselectable text-grey-lighten-3'
									>
										{{ item.name }}
									</span>
									<v-icon
										class='ml-3'
										:icon='get_icon(item.sort_by)'
										size='x-small'
										@click='sort_click(item.sort_by)'
									/>
								</v-col>
							</v-row>
						</v-col>

					</v-row>

					<v-row class='ma-0 pa-0 text-left align-center justify-center'>

						<v-col class='ma-0 pa-0' cols='12'>
							<section v-for='(flight, index) in local_current_flights' :key='flight.aircraft.mode_s'>
								<AuthenticatedAircraftRow
									:flight
									:index
									:show-divider='index !== number_current_flights - 1'
								/>
							</section>
						</v-col>
					</v-row>

				</section>

			</v-expand-transition>
			<v-row v-if='!number_current_flights' class='ma-0 pa-0 align-center justify-center'>
				<v-col class='ma-0 pa-0 text-headline-small unselectable text-grey-lighten-3' cols='auto'>
					no flights overhead
				</v-col>
			</v-row>
		</div>
		<v-row v-else class='minh align-center'>
			<v-col class='ma-0 pa-0 my-6' cols='auto'>
				<v-progress-circular color='primary' indeterminate />
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang="ts">

import type { TAdsbdb, TSortBy, u } from '@/types'
import { mdiArrowDownThick, mdiArrowUpThick, mdiSort } from '@mdi/js'
const aircraftStore = aircraftModule()

const local_current_flights = ref([] as Array<TAdsbdb>)

const current_flights = computed((): Array<TAdsbdb> => aircraftStore.current_flights)

onMounted(() => {
	local_current_flights.value = [...current_flights.value]
	sort_local()
})

const init = computed(() => aircraftStore.init)
const number_current_flights = computed(() => current_flights.value.length)

const imageCache = computed(() =>
	current_flights.value
		.map(f => f.aircraft?.url_photo)
		.filter(Boolean),
)

function get_icon (x: TSortBy): string {
	if (sort_by.value === x) {
		return sort_asc.value ? mdiArrowDownThick : mdiArrowUpThick
	}
	return mdiSort
}

function sort_click (x: TSortBy): void {
	if (!sort_by.value || sort_by.value !== x) {
		sort_by.value = x
	} else if (sort_asc.value) {
		sort_asc.value = !sort_asc.value
	} else if (!sort_asc.value) {
		aircraftStore.reset_sort()
	}
}

const sort_by = computed({
	get (): u<TSortBy> {
		return aircraftStore.sort_by
	},
	set (b: u<TSortBy>): void {
		aircraftStore.set_sort_by(b)
	},
})

const sort_asc = computed({
	get (): boolean {
		return aircraftStore.sort_asc
	},
	set (b: boolean): void {
		aircraftStore.set_sort_asc(b)
	},
})

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

]

function sort_local (): void {
	if (sort_by.value) {
		switch (sort_by.value) {
			case 'altitude': {
				local_current_flights.value.sort((a, b) => {
					if (sort_asc.value) {
						return a.altitude >= b.altitude ? 1 : -1
					} else {
						return a.altitude >= b.altitude ? -1 : 1
					}
				})

				break
			}
			case 'aircraft': {
				local_current_flights.value.sort((a, b) => {
					const aircraft_a = `${a.aircraft.manufacturer} ${a.aircraft.icao_type}`
					const aircraft_b = `${b.aircraft.manufacturer} ${b.aircraft.icao_type}`
					if (sort_asc.value) {
						return aircraft_a.toLowerCase() >= aircraft_b.toLowerCase() ? 1 : -1
					} else {
						return aircraft_a.toLowerCase() >= aircraft_b.toLowerCase() ? -1 : 1
					}
				})

				break
			}
			case 'owner': {
				local_current_flights.value.sort((a, b) => {
					if (sort_asc.value) {
						return a.aircraft.registered_owner.toLowerCase() >= b.aircraft.registered_owner.toLowerCase() ? 1 : -1
					} else {
						return a.aircraft.registered_owner.toLowerCase() >= b.aircraft.registered_owner.toLowerCase() ? -1 : 1
					}
				})

				break
			}
			default: {
				local_current_flights.value.sort((a, b) => {
					const callsign_a = a.callsign || 'z'
					const callsign_b = b.callsign || 'z'
					if (sort_asc.value) {
						return callsign_a >= callsign_b ? 1 : -1
					} else {
						return callsign_a >= callsign_b ? -1 : 1
					}
				})
			}
		}
	} else {
		local_current_flights.value.sort((a, b) => {
			const callsign_a = a.callsign || 'z'
			const callsign_b = b.callsign || 'z'
			return callsign_a === callsign_b ? (a.altitude > b.altitude ? 1 : 0) : (callsign_a > callsign_b ? 1 : 0)
		})
	}
}

watch(sort_asc, () => {
	sort_local()
})
watch(sort_by, () => {
	sort_local()
})

watch(current_flights, i => {
	local_current_flights.value = [...i]
	sort_local()
})

</script>

<style>
.headers {
    border-top-right-radius: .25rem;
    border-top-left-radius: .25rem;
}
</style>
