<template>
	<v-btn
		@click='toggle'
		:disabled='loading'
		:size='mobile?`small`:`default`'
		:variant='loading ?"outlined":"flat"'
		class='fab-fix elevation-0'
		color='danger'
		rounded
	>
		<v-row align='center' justify='space-around' class='ma-0 pa-0'>
			<v-col cols='auto' class='ma-0 pa-0'>
				<v-icon class='mr-1' color='black' :icon='icon' />
			</v-col>
			<v-col cols='auto' class='ma-0 pa-0 text-black' >
				turn screen {{ text }}
			</v-col>
		</v-row>

	</v-btn>
</template>

<script setup lang="ts">
import { mdiMonitor, mdiMonitorOff } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const emit = defineEmits([ 'toggle' ]);

const icon = computed((): string => {
	return screen_status.value ? mdiMonitorOff : mdiMonitor;
});
const loading = computed((): boolean => {
	return loadingModule().loading;
});

const screen_status = computed((): boolean => {
	return flightboxStatusModule().screen_on;
});
const text = computed((): string => {
	return screen_status.value ? 'off' : 'on';
});

const toggle = (): void => {
	emit('toggle');
};
</script>