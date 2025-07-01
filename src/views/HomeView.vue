<template>
	<section class='fill-height minh'>
		<v-row justify='center' align='center' class='minh' v-if='init && !flightInit && !online'>
			<v-col cols='12' class='ma-0 pa-0'>
				<AppOffline />
			</v-col>
			<v-col cols='12' lg='11' class='ma-0 pa-0'>
				<PiInfo @refresh='refresh' :updateCount='updateCount' />
			</v-col>
		</v-row>

		<section v-else>
			<v-row class='ma-0 pa-0 ' justify='center' align='center' v-if='init && flightInit && online'>
				<v-col cols='12' class='ma-0 pa-0'>
					<v-row align='center' justify='center' class='ma-0 pa-0'>
						<v-col cols='12' lg='11' class='ma-0 pa-0'>
							<CurrentFlights class='my-1' />
						</v-col>
					</v-row>

					<v-row align='center' justify='center' class='ma-0 pa-0'>
						<v-col cols='12' lg='11' class='ma-0 pa-0'>

							<v-row align='center' :justify='smAndDown ? "space-around" : "space-between"'
								class='ma-0 pa-0'>

								<v-col cols='2' v-if='!smAndDown' class='ma-0 pa-0' />

								<v-col cols='auto' class='ma-0 pa-0 mt-2'>
									<ExpandAll @toggle='toggle' />
								</v-col>

								<v-col cols='auto' class='ma-0 pa-0 mt-2'>
									<ToggleScreen @toggle='toggle' />
								</v-col>

								<v-col cols='auto' class='ma-0 pa-0 mt-2'>
									<ForceUpdate @refresh='refresh' :updateCount='updateCount' />
								</v-col>

								<v-col cols='12' md='2' class='ma-0 pa-0'>
									<v-row class='ma-0 pa-0' align='center' :justify='smAndDown ? "center" : "end"'
										v-if='currentFlights > 0'>
										<v-col cols='auto' class='ma-0 pa-0'>
											<v-switch density='compact' flat color='primary' v-model='metric' />
										</v-col>
										<v-col cols='auto'
											class='ml-2 mt-n5 font-weight-bold ma-0 pa-0 text-uppercase unselectable text-white'
											:class='{ "text-primary": metric, "small-text": smAndDown }'>
											metric
										</v-col>
									</v-row>
								</v-col>
							</v-row>
						</v-col>

					</v-row>
					<v-row align='center' justify='center' class='ma-0 pa-0'>
						<v-col cols='12' lg='11' class='ma-0 pa-0'>
							<PiInfo @refresh='refresh' :updateCount='updateCount' />
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row justify='center' align='center' class='minh' v-else>
				<v-col cols='auto' class='ma-0 pa-0'>
					<v-progress-circular indeterminate color='primary' />
				</v-col>
			</v-row>

		</section>
	</section>
</template>

<script setup lang='ts'>
import { parseMessage } from '@/vanillaTS/messageParser';
import { snackError } from '@/services/snack';
import type { TWSFromFlightBox } from '@/types';
import { ws } from '@/services/WS';
import { useDisplay } from 'vuetify';
import type ExpandAll from '@/components/Authenticated/ExpandAll.vue';

const { smAndDown } = useDisplay();

const [
	aircraftStore,
	flightboxStatusStore,
	loadingStore,
	userStore,
	websocketStore
] = [aircraftModule(), flightboxStatusModule(), loadingModule(), userModule(), websocketModule()];

onUnmounted(() => {
	clearAllIntervals();
});

const currentFlights = computed(() => aircraftStore.number_current_flights);
const flightInit = computed(() => aircraftStore.init);
const init = computed(() => flightboxStatusStore.init);
const online = computed(() => flightboxStatusStore.online);
const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});
const metric = computed({
	get (): boolean {
		return aircraftStore.metric;
	},
	set (b: boolean): void {
		aircraftStore.set_metric(b);
	}
});
const uptimeApp = computed({
	get (): number {
		return flightboxStatusStore.uptime_app;
	},
	set (n: number): void {
		flightboxStatusStore.set_uptimeApp(n);
	}
});
const screen_status = computed({
	get (): boolean {
		return flightboxStatusStore.screen_on;
	},
	set (b: boolean): void {
		flightboxStatusStore.set_screen_on(b);
	}
});
const uptime = computed({
	get (): number {
		return flightboxStatusStore.uptime;
	},
	set (n: number): void {
		flightboxStatusStore.set_uptime(n);
	}
});

const uptimeWs = computed({
	get (): number {
		return flightboxStatusStore.uptime_ws;
	},
	set (n: number): void {
		flightboxStatusStore.set_uptime_ws(n);
	}
});
const ws_connected = computed(() => websocketStore.connected);

const initCount = ref(0);
const initTimeout = ref(0);
const updateCount = ref(60);
const updateInterval = ref(0);
const offlineTimeout = ref(0);

const resetUpdateCounter = (): void => {
	updateCount.value = 60;
};

const addWSHandlers = (): void => {
	ws.connection?.addEventListener('message', (data) => {
		try {
			const message = parseMessage(data.data);
			if (!message) throw Error(`can't parse message`);
			wsDataHandler(message);
		} catch (e) {
			const message = e instanceof Error ? e.message : 'ERROR';
			snackError({ message });
		}
	});

	send_status_and_flights();

	// Although should never have the connection killed
	ws.connection?.addEventListener('close', () => {
		userStore.logout();
	});
};

const clearAllIntervals = (): void => {
	clearTimeout(initTimeout.value);
	clearInterval(updateInterval.value);
	clearTimeout(offlineTimeout.value);
};

/**
 * If a message isn't received within the first 10000ms(x4) of being mounted, logout
 *
 */
const initCheck = (): void => {
	initCount.value++;
	loading.value = true;
	initTimeout.value = window.setTimeout(() => {
		if (init.value) {
			clearInterval(initTimeout.value);
			loading.value = false;
		} else if (initCount.value < 4) {
			snackError({ message: 'No message received, retrying' });
			send_status_and_flights();
			initCheck();
		} else userStore.logout('unable to contact flightbox');
	}, 8500);
};

const refresh = (): void => {
	clearInterval(updateInterval.value);
	send_status_and_flights();
	resetUpdateCounter();
	startUpdateTimeout();
};

const send_status_and_flights = (): void => {
	send_flights();
	send_status();
};

const send_flights = (): void => {
	websocketStore.send({ message: 'flights' });
};

const send_status = (): void => {
	websocketStore.send({ message: 'status' });
};

const startUpdateTimeout = (): void => {
	updateInterval.value = window.setInterval(() => {
		if (updateCount.value === 0) {
			send_status_and_flights();
			resetUpdateCounter();
		} else {
			updateCount.value--;
		}
		if (online.value && uptimeWs.value) uptimeWs.value++;
		if (online.value && uptime.value) uptime.value++;
		if (online.value && uptimeApp) uptimeApp.value++;
	}, 1000);
};

const toggle = (): void => {
	const message = screen_status.value ? 'off' : 'on';
	loading.value = true;
	websocketStore.send({ message });
	setTimeout(() => {
		send_status();
	}, 250);
};

const wsDataHandler = async (message: TWSFromFlightBox): Promise<void> => {
	switch (message.data?.message) {
		case 'status': {
			flightboxStatusStore.set_internal_ip(message.data.data.internal_ip);
			flightboxStatusStore.set_online(!message.cache);
			flightboxStatusStore.set_api_version(message.data.data.api_version);
			flightboxStatusStore.set_screen_on(message.data.data.screen_on);
			uptime.value = message.data.data.uptime;
			uptimeApp.value = message.data.data.uptime_app;
			uptimeWs.value = message.data.data.uptime_ws;
			loading.value = false;
			break;
		}
		case 'flights': {
			aircraftStore.set_current_flights(message.data.data);
			aircraftStore.set_init(true);
			if (!init.value) {
				startUpdateTimeout();
				flightboxStatusStore.set_init(true);
			}
			initCount.value = 0;
		}
	}
};

onMounted(() => {
	initCheck();
});

watch(ws_connected, (i: boolean) => {
	if (i) {
		addWSHandlers();
	}
});

</script>

<style scoped>
.minh {
	min-height: 180px;
}
</style>
