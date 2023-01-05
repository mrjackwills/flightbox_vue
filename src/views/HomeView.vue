<template>
	<section class='fill-height'>
		<v-expand-transition>
			<v-row class='ma-0 pa-0 minh' justify='center' align='center' v-if='flightInit'>
				<v-col cols='12' class='ma-0 pa-0'>
					<v-row align='center' justify='center' class='ma-0 pa-0'>
						<v-col cols='12' lg='11' class='ma-0 pa-0'>
							<CurrentFlights class='my-1' />
						</v-col>
					</v-row>

					<v-row align='center' justify='center' class='ma-0 pa-0'>
						<v-col cols='12' lg='11' class='ma-0 pa-0'>
						
							<v-row align='center' :justify='mobile ? "space-around": "space-between"' class='ma-0 pa-0'>

								<v-col cols='2' v-if='!mobile' class='ma-0 pa-0' />

								<v-col cols='auto' class='ma-0 pa-0 mt-2'>
									<ToggleScreen @toggle='toggle' />
								</v-col>

								<v-col cols='auto' class='ma-0 pa-0 mt-2'>
									<ForceUpdate @refresh='refresh' :updateCount='updateCount' />
								</v-col>

								<v-col cols='12' md='2' class='ma-0 pa-0'>
									<v-row class='ma-0 pa-0' align='center' :justify='mobile?"center":"end"' v-if='currentFlights>0'>
										<v-col cols='auto' class='ma-0 pa-0'>
											<v-switch small v-model='metric' />
										</v-col>
										<v-col cols='auto' class='ml-2 mt-n5 ma-0 pa-0 text-uppercase unselectable' :class='{"text-haze":metric, "small-text": mobile}' >
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
		</v-expand-transition>
		<v-row justify='center' align='center' class='minh' v-if='!flightInit'>
			<v-col cols='auto' class='ma-0 pa-0'>
				<v-progress-circular indeterminate color='offwhite' />
			</v-col>
		</v-row>

	</section>
</template>

<script setup lang='ts'>
import CurrentFlights from '@/components/Authenticated/CurrentFlights.vue';
import ToggleScreen from '@/components/Authenticated/ToggleScreen.vue';
import PiInfo from '@/components/Authenticated/PiInfo.vue';
import ForceUpdate from '@/components/Authenticated/ForceUpdate.vue';
import { parseMessage } from '@/vanillaTS/messageParser';
import { snackError } from '@/services/snack';
import type { TWSFromFlightBox } from '@/types';
import { ws } from '@/services/WS';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const [ aircraftStore, flightboxStatusStore, loadingStore, userStore, websocketStore ] = [ aircraftModule(), flightboxStatusModule(), loadingModule(), userModule(), websocketModule() ];

onUnmounted(() => {
	clearAllIntervals();
});

const currentFlights = computed((): number => {
	return aircraftStore.number_current_flights;
});
const flightInit = computed((): boolean => {
	return aircraftStore.init;
});
const init = computed((): boolean => {
	return flightboxStatusStore.init;
});
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
const ws_connected = computed(() => {
	return websocketStore.connected;
});

const initCount = ref(0);
const initTimeout = ref(0);
const updateCount = ref(30);
const updateInterval = ref(0);

const resetUpdateCounter = (): void => {
	updateCount.value = 30;
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
	ws.connection?.addEventListener('close', (_event) => {
		userStore.logout();
	});
};

const clearAllIntervals = (): void => {
	clearTimeout(initTimeout.value);
	clearInterval(updateInterval.value);
};

/**
* If a message isn't received within the first 10000ms(x4) of being mounted, logout
* */
const initCheck = (): void => {
	initCount.value ++;
	loading.value = true;
	initTimeout.value = window.setTimeout(() => {
		if (init) {
			clearInterval(initTimeout.value);
			loading.value = false;
		}
		else if (initCount.value < 4) {
			send_status_and_flights();
			initCheck();
		}
		else userStore.logout('unable to contact flightbox');
	}, 10000);
};

const refresh = () :void => {
	clearInterval(updateInterval.value);
	send_status_and_flights();
	resetUpdateCounter();
	startUpdateTimeout();
};

const send_status_and_flights = () :void => {
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
	updateInterval.value = setInterval(() => {
		if (updateCount.value === 0) {
			send_status_and_flights();
			resetUpdateCounter();
		} else {
			updateCount.value --;
		}
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
		initCount.value = 0;
		if (!init.value) startUpdateTimeout();
		flightboxStatusStore.set_init(true);
		loading.value = false;
		break;
	}
	case 'flights': {
		aircraftStore.set_current_flights(message.data.data);
		aircraftStore.set_init(true);
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
