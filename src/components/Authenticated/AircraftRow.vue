<template>
	<v-row class='ma-0 pa-0 text-grey-lighten-3' justify='center' align='center'>
		<v-col cols='12' class='ma-0 pa-0 '>
			<v-row class='ma-0 pa-0  all-rows' :class='backgroundColor' justify='space-between' align='center'>
				<v-col cols='3' class='ma-0 pa-0' :class='{ "small-text": mobile }'>

					<v-row class='ma-0 pa-0' align='center' justify='start'>

						<template v-if='flight.flightroute'>
							<v-col cols='auto' class='ma-0 pa-0 mr-1'>
								<a :href='href' target='_blank' rel='noopener noreferrer' v-if='flight.flightroute'>
									<v-icon size='x-small' color='grey-lighten-4' class='mx-1' :icon='mdiOpenInNew' />
								</a>
							</v-col>

							<v-col cols='auto' class='ma-0 pa-0'>
								<v-icon class='fab-fix cl' @click='toggleCallsign' size='x-small'
									:color='callsignArrowColor' :icon='callsignArrowDirection' />
							</v-col>

							<v-col cols='12' md='auto' class='ma-0 pa-0 ml-1'>
								<span class='mono-numbers '>{{ flight.callsign }} </span>
							</v-col>

						</template>

						<v-col v-else cols='auto' class='ma-0 pa-0 mx-2'>
							<span>N/A</span>
						</v-col>
					</v-row>

				</v-col>

				<v-col cols='3' class='ma-0 pa-0' :class='{ "small-text": mobile }'>

					<v-row class='ma-0 pa-0' align='center'>

						<v-tooltip v-if='!mobile_platform && flight.aircraft.url_photo_thumbnail' activator='parent'
							location='top' content-class='tooltip'>
							<v-img width='250px' eager :src='flight.aircraft.url_photo_thumbnail' />
						</v-tooltip>

						<v-col cols='auto' class='ma-0 pa-0' :class='{ "cl": flight.aircraft.url_photo }'
							@click='setPhotoUrl'>
							<v-icon color='grey-lighten-4' class='mr-1' v-if='flight.aircraft.url_photo' size='x-small'
								:icon='mdiCamera' />
							{{ flight.aircraft.manufacturer }} {{ flight.aircraft.type }}
						</v-col>

						<v-spacer />

						<v-col cols='auto' class='ma-0 pa-0 mono-numbers'>
							( {{ flight.aircraft.mode_s }} )
						</v-col>
					</v-row>

				</v-col>

				<v-col cols='3' class='ma-0 pa-0 text-right' :class='{ "small-text": mobile }'>
					{{ flight.aircraft.registered_owner }}
				</v-col>

				<v-col cols='3' class='ma-0 pa-0 text-right mono-numbers pr-2' :class='{ "small-text": mobile }'>
					<span>{{ calcAltitude }}</span>
				</v-col>
			</v-row>
		</v-col>

		<v-expand-transition>
			<v-col cols='12' class='ma-0 pa-0' v-if='expanded && flight.flightroute'>
				<FlightRoute :flightroute='flight.flightroute' :fl_index='index' />
			</v-col>
		</v-expand-transition>

	</v-row>
</template>

<script setup lang="ts">
import { mdiCamera, mdiArrowCollapse, mdiArrowExpand, mdiOpenInNew } from '@mdi/js';
import type { TAdsbdb } from '@/types';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const mobile_platform = ref(false);

const platform = computed(() => useDisplay().platform.value);

watch(platform, (i) => {
	mobile_platform.value = i.ios || i.android;
});

onMounted(() => {
	const platform = useDisplay().platform.value;
	mobile_platform.value = platform.ios || platform.android;
});

const callsignArrowColor = computed(() => showExtra.value ? 'primary' : 'secondary');
const callsign = computed(() => !!props.flight.flightroute);
const href = computed(() => !props.flight.callsign ? '' : `https://www.flightradar24.com/${props.flight.callsign}`);
const metric = computed(() => aircraftModule().metric);
const expanded = computed(() => showExtra.value);
const backgroundColor = computed(() => `bg-grey-darken-${props.index % 2 === 0 ? '3' : '4'}`);
const callsignArrowDirection = computed(() => showExtra.value ? mdiArrowCollapse : mdiArrowExpand);

const calcAltitude = computed((): string => {
	const altitude = props.flight.altitude;
	if (!altitude) return '';
	return metric.value ? `${(altitude * 0.3048).toFixed(1)}m` : `${altitude}ft`;
});

const showExtra = ref(false);

const setPhotoUrl = (): void => {
	if (!props.flight.aircraft.url_photo) return;
	const dialogStore = dialogModule();
	dialogStore.set_imgSrc(props.flight.aircraft.url_photo);
	dialogStore.set_visible(true);
	dialogStore.set_title(`${props.flight.aircraft.registered_owner}: ${props.flight.aircraft.manufacturer} ${props.flight.aircraft.type}`);
};

watch(() => aircraftModule().all_expanded, (i) => {
	showExtra.value = i;
});

const toggleCallsign = (): void => {
	showExtra.value = !showExtra.value;
};

const props = defineProps<{
	flight: TAdsbdb;
	index: number;
	showDivider: boolean;
}>();

watch(callsign, (i) => {
	if (!i) showExtra.value = false;

});
</script>

<style scoped>
.all-rows {
	min-height: 2rem;
}
</style>