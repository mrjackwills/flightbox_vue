<template>
	<v-btn @click='toggle' :disabled='loading' :size='mobile ? `small` : `default`' :variant='loading ? "outlined" : "flat"'
		class='fab-fix elevation-0' :color='color' rounded>
		<v-row align='center' justify='space-around' class='ma-0 pa-0'>
			<v-col cols='auto' class='ma-0 pa-0'>
				<v-icon class='mr-1' color='black' :icon='icon' />
			</v-col>
			<v-col cols='auto' class='ma-0 pa-0 text-black'>
				{{ text }} all
			</v-col>
		</v-row>

	</v-btn>
</template>

<script setup lang="ts">
import { mdiArrowCollapse, mdiArrowExpand } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const all_expanded = computed(() => aircraftModule().all_expanded);
const color = computed(() => all_expanded.value ? 'primary' : 'secondary');
const icon = computed(() => all_expanded.value ? mdiArrowCollapse : mdiArrowExpand);
const loading = computed(() => loadingModule().loading);
const text = computed(() => all_expanded.value ? 'minimize' : 'expand');

const toggle = (): void => {
	aircraftModule().set_all_expanded(!all_expanded.value);
};
</script>