<template>
	<v-btn
		@click='refresh'
		:disabled='buttonDisabled'
		:size='mobile ? `small`:`default`'
		:variant='buttonDisabled ?"outlined":"flat"'
		class='fab-fix elevation-0'
		color='secondary'
		dark
		rounded
	>
		<v-row align='center' justify='space-around' class='ma-0 pa-0'>
			<v-col cols='auto' class='ma-0 pa-0' >
				<v-icon class='mr-1' color='' :icon='mdiRefresh' />
			</v-col>
			<v-col cols='auto' class='ma-0 pa-0 mono-numbers'>
				{{ buttonText }}
			</v-col>
		</v-row>

	</v-btn>

</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { mdiRefresh } from '@mdi/js';
import { zeroPad } from '@/vanillaTS/zeropad';
const { mobile } = useDisplay();

const emit = defineEmits([ 'refresh' ]);

const props = defineProps<{updateCount: number}>();

const buttonDisabled = computed(() : boolean=> {
	return loading.value || updating.value;
});

const buttonText = computed(() : string => {
	return `next update ${zeroPad(props.updateCount)}`;
});

const loading = computed((): boolean => {
	return loadingModule().loading;
});

const updating = computed(():boolean => {
	return props.updateCount === 0;
});

const refresh = ():void => {
	if (loading.value) return;
	emit('refresh');
};

</script>