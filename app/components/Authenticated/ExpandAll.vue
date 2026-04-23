<template>
	<v-btn
		class='fab-fix elevation-0'
		:color
		:disabled='loading'
		rounded
		:size='mobile ? `small` : `default`'
		:variant='loading ? "outlined" : "flat"'
		@click='toggle'
	>
		<v-row class='ma-0 pa-0 align-center justify-space-around'>
			<v-col class='ma-0 pa-0' cols='auto'>
				<v-icon class='mr-1' color='black' :icon />
			</v-col>
			<v-col class='ma-0 pa-0 text-black' cols='auto'>
				{{ text }} all
			</v-col>
		</v-row>

	</v-btn>
</template>

<script setup lang="ts">
import { mdiArrowCollapse, mdiArrowExpand } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const all_expanded = computed(() => aircraftModule().all_expanded)
const color = computed(() => all_expanded.value ? 'primary' : 'secondary')
const icon = computed(() => all_expanded.value ? mdiArrowCollapse : mdiArrowExpand)
const loading = computed(() => loadingModule().loading)
const text = computed(() => all_expanded.value ? 'minimize' : 'expand')

function toggle (): void {
	aircraftModule().set_all_expanded(!all_expanded.value)
}
</script>
