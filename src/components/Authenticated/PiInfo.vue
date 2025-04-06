<template>

	<v-row justify='center' align='center' class='ma-0 pa-0' no-gutters>

		<DisplayRows :toDisplay='info' class='mb-2 mt-4' />

	</v-row>
</template>

<script setup lang='ts'>

import { mdiDesktopClassic, mdiFormatListNumbered, mdiLanConnect, mdiMonitorShimmer, mdiLanguageRust, mdiWebClock, mdiSourceBranch } from '@mdi/js';
import { secondsToText } from '@/vanillaTS/secondsToText';
import type { TDataToDisplay } from '@/types';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
const [aircraftStore, flightboxStatusStore] = [aircraftModule(), flightboxStatusModule()];

const api_version = computed(() => flightboxStatusStore.api_version);
const info = computed((): TDataToDisplay => [

	[
		{
			icon: mdiMonitorShimmer,
			text: 'screen',
			value: screen_on.value ? 'on' : 'off',
			copy: false
		},
		{
			icon: mdiFormatListNumbered,
			text: 'planes overhead',
			value: `${number_tracked_flight.value}`,
			copy: false
		}
	],
	[
		{
			icon: mdiSourceBranch,
			text: 'api version',
			value: api_version.value,
			copy: false
		},

		{
			icon: mdiLanConnect,
			text: `internal ip`,
			value: internal_ip.value,
			copy: true
		}
	],
	[
		{
			icon: mdiDesktopClassic,
			text: 'flightbox uptime',
			value: secondsToText(uptime.value ? uptime.value * 1000 : 0, mobile.value),
			copy: false
		},
		{
			icon: mdiLanguageRust,
			text: 'app uptime',
			value: secondsToText(uptimeApp.value ? uptimeApp.value * 1000 : 0, mobile.value),
			copy: false
		}
	],
	[{
		icon: mdiWebClock,
		text: 'websocket uptime',
		value: secondsToText(uptimeWs.value ? uptimeWs.value * 1000 : 0, mobile.value),
		copy: false
	}
	]
]);
const internal_ip = computed(() => flightboxStatusStore.internal_ip);
const uptimeApp = computed(() => flightboxStatusStore.uptime_app);
const number_tracked_flight = computed(() => aircraftStore.number_current_flights);
const screen_on = computed(() => flightboxStatusStore.screen_on);
const uptime = computed(() => flightboxStatusStore.uptime);
const uptimeWs = computed(() => flightboxStatusStore.uptime_ws);
</script>