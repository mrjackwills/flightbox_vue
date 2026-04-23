<template>
	<!-- fill-height  -->
	<section v-if='init' class='ma-0 pa-0 w-100 fill-height'>
		<v-row v-if='!flightInit && !online' class='align-center justify-center'>
			<v-col class='ma-0 pa-0' cols='12'>
				<AuthenticatedAppOffline />
			</v-col>
			<v-col class='ma-0 pa-0' cols='12' lg='11'>
				<AuthenticatedPiInfo :update-count @refresh='refresh' />
			</v-col>
		</v-row>

		<!-- <section v-else> -->
		<v-row v-if='flightInit && online' class='ma-0 pa-0 align-center justify-center'>
			<v-col class='ma-0 pa-0' cols='12'>
				<v-row class='ma-0 pa-0 align-center justify-center'>
					<v-col class='ma-0 pa-0' cols='12' lg='11'>
						<AuthenticatedCurrentFlights class='my-1' />
					</v-col>
				</v-row>

				<v-row class='ma-0 pa-0 align-center justify-center'>
					<v-col class='ma-0 pa-0' cols='12' lg='11'>

						<v-row class='ma-0 pa-0 align-center justify-space-between'>

							<v-col class='ma-0 pa-0' cols='4'>
								<v-row class='ma-0 pa-0 align-center justify-center'>
									<v-col class='ma-0 pa-0' cols='auto'>
										<AuthenticatedExpandAll />
									</v-col>
								</v-row>
							</v-col>

							<v-col class='ma-0 pa-0' cols='4'>
								<v-row class='ma-0 pa-0 align-center justify-center'>
									<v-col class='ma-0 pa-0' cols='auto'>
										<AuthenticatedForceUpdate :update-count @refresh='refresh' />
									</v-col>
								</v-row>
							</v-col>

							<v-col class='ma-0 pa-0' cols='4'>
								<v-row class='ma-0 pa-0 align-center justify-center'>
									<v-col class='ma-0 pa-0 pt-6' cols='auto'>
										<v-row
											v-if='currentFlights > 0'
											class='ma-0 pa-0 align-center'
											:class='smAndDown ? "justify-center" : "justify-end"'
										>
											<v-col class='ma-0 pa-0' cols='auto'>
												<v-switch v-model='metric' color='primary' density='compact' flat />
											</v-col>
											<v-col
												class='ml-2 mt-n5 font-weight-bold ma-0 pa-0 text-uppercase unselectable text-white'
												:class='{ "text-primary": metric, "small-text": smAndDown }'
												cols='auto'
											>
												metric
											</v-col>
										</v-row>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</v-col>

				</v-row>
				<v-row class='ma-0 pa-0 align-center justify-center'>
					<v-col class='ma-0 pa-0' cols='12' lg='11'>
						<AuthenticatedPiInfo :update-count @refresh='refresh' />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</section>
	<section v-else class='w-100 ma-0 pa-0'>
		<v-row class='minh align-center justify-center'>
			<v-col class='ma-0 pa-0' cols='auto'>
				<v-progress-circular color='primary' indeterminate />
			</v-col>
		</v-row>

	</section>
</template>

<script lang='ts' setup>
import type { TWSFromFlightBox } from '@/types'
import { useDisplay } from 'vuetify'
import { snackError } from '@/services/snack'
import { ws } from '@/services/WS'
import { parseMessage } from '@/utils/messageParser'

const { smAndDown } = useDisplay()

const [
	aircraftStore,
	flightboxStatusStore,
	loadingStore,
	userStore,
	websocketStore,
] = [aircraftModule(), flightboxStatusModule(), loadingModule(), userModule(), websocketModule()]

onUnmounted(() => {
	clearAllIntervals()
})

const currentFlights = computed(() => aircraftStore.number_current_flights)
const flightInit = computed(() => aircraftStore.init)
const init = computed(() => flightboxStatusStore.init)
const online = computed(() => flightboxStatusStore.online)
const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean): void {
		loadingStore.set_loading(b)
	},
})
const metric = computed({
	get (): boolean {
		return aircraftStore.metric
	},
	set (b: boolean): void {
		aircraftStore.set_metric(b)
	},
})
const uptimeApp = computed({
	get (): number {
		return flightboxStatusStore.uptime_app
	},
	set (n: number): void {
		flightboxStatusStore.set_uptimeApp(n)
	},
})
const uptime = computed({
	get (): number {
		return flightboxStatusStore.uptime
	},
	set (n: number): void {
		flightboxStatusStore.set_uptime(n)
	},
})

const uptimeWs = computed({
	get (): number {
		return flightboxStatusStore.uptime_ws
	},
	set (n: number): void {
		flightboxStatusStore.set_uptime_ws(n)
	},
})
const ws_connected = computed(() => websocketStore.connected)

const initCount = ref(0)
const initTimeout = ref(0)
const updateCount = ref(60)
const updateInterval = ref(0)
const offlineTimeout = ref(0)

function resetUpdateCounter (): void {
	updateCount.value = 60
}

function addWSHandlers (): void {
	ws.connection?.addEventListener('message', data => {
		try {
			const message = parseMessage(data.data)
			if (!message) throw new Error(`can't parse message`)
			wsDataHandler(message)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'ERROR'
			snackError({ message })
		}
	})

	send_status_and_flights()

	// Although should never have the connection killed
	ws.connection?.addEventListener('close', () => {
		userStore.logout()
	})
}

function clearAllIntervals (): void {
	clearTimeout(initTimeout.value)
	clearInterval(updateInterval.value)
	clearTimeout(offlineTimeout.value)
}

/**
		* If a message isn't received within the first 10000ms(x4) of being mounted, logout
		*
		*/
function initCheck (): void {
	initCount.value++
	loading.value = true
	initTimeout.value = window.setTimeout(() => {
		if (init.value) {
			clearInterval(initTimeout.value)
			loading.value = false
		} else if (initCount.value < 4) {
			snackError({ message: 'No message received, retrying' })
			send_status_and_flights()
			initCheck()
		} else userStore.logout('unable to contact flightbox')
	}, 8500)
}

function refresh (): void {
	clearInterval(updateInterval.value)
	send_status_and_flights()
	resetUpdateCounter()
	startUpdateTimeout()
}

function send_status_and_flights (): void {
	send_flights()
	send_status()
}

function send_flights (): void {
	websocketStore.send({ message: 'flights' })
}

function send_status (): void {
	websocketStore.send({ message: 'status' })
}

function startUpdateTimeout (): void {
	updateInterval.value = window.setInterval(() => {
		if (updateCount.value === 0) {
			send_status_and_flights()
			resetUpdateCounter()
		} else {
			updateCount.value--
		}
		if (online.value && uptimeWs.value) uptimeWs.value++
		if (online.value && uptime.value) uptime.value++
		if (online.value && uptimeApp) uptimeApp.value++
	}, 1000)
}

async function wsDataHandler (message: TWSFromFlightBox): Promise<void> {
	switch (message.data?.message) {
		case 'status': {
			flightboxStatusStore.set_internal_ip(message.data.data.internal_ip)
			flightboxStatusStore.set_online(!message.cache)
			flightboxStatusStore.set_api_version(message.data.data.api_version)
			uptime.value = message.data.data.uptime
			uptimeApp.value = message.data.data.uptime_app
			uptimeWs.value = message.data.data.uptime_ws
			loading.value = false
			break
		}
		case 'flights': {
			aircraftStore.set_current_flights(message.data.data)
			aircraftStore.set_init(true)
			if (!init.value) {
				startUpdateTimeout()
				flightboxStatusStore.set_init(true)
			}
			initCount.value = 0
		}
	}
}

onMounted(() => {
	initCheck()
})

watch(ws_connected, (i: boolean) => {
	if (i) {
		addWSHandlers()
	}
})

</script>

<style scoped>
.minh {
	min-height: 180px;
}
</style>
