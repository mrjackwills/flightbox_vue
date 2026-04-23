<template>

	<v-row class='ma-0 pa-0 align-center justify-center'>

		<AuthenticatedDisplayRows class='mb-2 mt-4' :to-display='info' />

	</v-row>
</template>

<script setup lang='ts'>

import type { TDataToDisplay } from '@/types'
import { mdiDesktopClassic, mdiFormatListNumbered, mdiLanConnect, mdiLanguageRust, mdiSourceBranch, mdiWebClock } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { secondsToText } from '@/utils/secondsToText'

const { mobile } = useDisplay()
const [aircraftStore, flightboxStatusStore] = [aircraftModule(), flightboxStatusModule()]

const api_version = computed(() => flightboxStatusStore.api_version)
const info = computed((): TDataToDisplay => [

	[
		{
			icon: mdiFormatListNumbered,
			text: 'planes overhead',
			value: `${number_tracked_flight.value}`,
			copy: false,
		},
		{
			icon: mdiSourceBranch,
			text: 'api version',
			value: api_version.value,
			copy: false,
		},
	],
	[

		{
			icon: mdiLanConnect,
			text: `internal ip`,
			value: internal_ip.value,
			copy: true,
		},
		{
			icon: mdiDesktopClassic,
			text: 'flightbox uptime',
			value: secondsToText(uptime.value ? uptime.value * 1000 : 0, mobile.value),
			copy: false,
		},
	],
	[

		{
			icon: mdiLanguageRust,
			text: 'app uptime',
			value: secondsToText(uptimeApp.value ? uptimeApp.value * 1000 : 0, mobile.value),
			copy: false,
		},
		{
			icon: mdiWebClock,
			text: 'websocket uptime',
			value: secondsToText(uptimeWs.value ? uptimeWs.value * 1000 : 0, mobile.value),
			copy: false,
		},
	],
])
const internal_ip = computed(() => flightboxStatusStore.internal_ip)
const uptimeApp = computed(() => flightboxStatusStore.uptime_app)
const number_tracked_flight = computed(() => aircraftStore.number_current_flights)
const uptime = computed(() => flightboxStatusStore.uptime)
const uptimeWs = computed(() => flightboxStatusStore.uptime_ws)
</script>
