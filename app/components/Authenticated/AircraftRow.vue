<template>
	<v-row align='center' class='ma-0 pa-0 text-grey-lighten-3' justify='center'>
		<v-col class='ma-0 pa-0 ' cols='12'>
			<v-row align='center' class='ma-0 pa-0  all-rows' :class='backgroundColor' justify='space-between'>
				<v-col class='ma-0 pa-0' :class='{ "small-text": mobile }' cols='3'>

					<v-row align='center' class='ma-0 pa-0' justify='start'>

						<template v-if='flight.flightroute'>
							<v-col class='ma-0 pa-0 mr-1' cols='auto'>
								<a v-if='flight.flightroute' :href rel='noopener noreferrer' target='_blank'>
									<v-icon class='mx-1' color='grey-lighten-4' :icon='mdiOpenInNew' size='x-small' />
								</a>
							</v-col>

							<v-col class='ma-0 pa-0' cols='auto'>
								<v-icon
									class='fab-fix cl'
									:color='callsignArrowColor'
									:icon='callsignArrowDirection'
									size='x-small'
									@click='toggleCallsign'
								/>
							</v-col>

							<v-col class='ma-0 pa-0 ml-1' cols='12' md='auto'>
								<span class='mono-numbers '>{{ flight.callsign }} </span>
							</v-col>

						</template>

						<v-col v-else class='ma-0 pa-0 mx-2' cols='auto'>
							<span>N/A</span>
						</v-col>
					</v-row>

				</v-col>

				<v-col class='ma-0 pa-0' :class='{ "small-text": mobile }' cols='3'>

					<v-row align='center' class='ma-0 pa-0'>

						<v-tooltip
							v-if='!mobile_platform && flight.aircraft.url_photo_thumbnail'
							activator='parent'
							content-class='tooltip'
							location='top'
						>
							<v-img eager :src='flight.aircraft.url_photo_thumbnail' width='250px' />
						</v-tooltip>

						<v-col
							class='ma-0 pa-0'
							:class='{ "cl": flight.aircraft.url_photo }'
							cols='auto'
							@click='setPhotoUrl'
						>
							<v-icon
								v-if='flight.aircraft.url_photo'
								class='mr-1'
								color='grey-lighten-4'
								:icon='mdiCamera'
								size='x-small'
							/>
							{{ flight.aircraft.manufacturer }} {{ flight.aircraft.type }}
						</v-col>

						<v-spacer />

						<v-col class='ma-0 pa-0 mono-numbers' cols='auto'>
							( {{ flight.aircraft.mode_s }} )
						</v-col>
					</v-row>

				</v-col>

				<v-col class='ma-0 pa-0 text-right' :class='{ "small-text": mobile }' cols='3'>
					{{ flight.aircraft.registered_owner }}
				</v-col>

				<v-col class='ma-0 pa-0 text-right mono-numbers pr-2' :class='{ "small-text": mobile }' cols='3'>
					<span>{{ calcAltitude }}</span>
				</v-col>
			</v-row>
		</v-col>

		<v-expand-transition>
			<v-col v-if='expanded && flight.flightroute' class='ma-0 pa-0' cols='12'>
				<AuthenticatedFlightRoute :fl-index='index' :flightroute='flight.flightroute' />
			</v-col>
		</v-expand-transition>

	</v-row>
</template>

<script setup lang="ts">
import type { TAdsbdb } from '@/types'
import { mdiArrowCollapse, mdiArrowExpand, mdiCamera, mdiOpenInNew } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const mobile_platform = ref(false)

const platform = computed(() => useDisplay().platform.value)

watch(platform, i => {
	mobile_platform.value = i.ios || i.android
})

onMounted(() => {
	const platform = useDisplay().platform.value
	mobile_platform.value = platform.ios || platform.android
})

const callsignArrowColor = computed(() => showExtra.value ? 'primary' : 'secondary')
const callsign = computed(() => !!props.flight.flightroute)
const href = computed(() => props.flight.callsign ? `https://www.flightradar24.com/${props.flight.callsign}` : '')
const metric = computed(() => aircraftModule().metric)
const expanded = computed(() => showExtra.value)
const backgroundColor = computed(() => `bg-grey-darken-${props.index % 2 === 0 ? '3' : '4'}`)
const callsignArrowDirection = computed(() => showExtra.value ? mdiArrowCollapse : mdiArrowExpand)
const calcAltitude = computed(() => props.flight.altitude ? (metric.value ? `${(props.flight.altitude * 0.3048).toFixed(1)}m` : `${props.flight.altitude}ft`) : '')

const showExtra = ref(false)

function setPhotoUrl (): void {
	if (!props.flight.aircraft.url_photo) return
	const dialogStore = dialogModule()
	dialogStore.set_imgSrc(props.flight.aircraft.url_photo)
	dialogStore.set_visible(true)
	dialogStore.set_title(`${props.flight.aircraft.registered_owner}: ${props.flight.aircraft.manufacturer} ${props.flight.aircraft.type}`)
}

watch(() => aircraftModule().all_expanded, i => {
	showExtra.value = i
})

function toggleCallsign (): void {
	showExtra.value = !showExtra.value
}

const props = defineProps<{
	flight: TAdsbdb
	index: number
	showDivider: boolean
}>()

watch(callsign, i => {
	if (!i) showExtra.value = false
})
</script>

<style scoped>
.all-rows {
    min-height: 2rem;
}
</style>
