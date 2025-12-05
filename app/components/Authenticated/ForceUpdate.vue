<template>
	<v-btn
		class='fab-fix elevation-0'
		color='white'
		dark
		:disabled='buttonDisabled'
		rounded
		:size='mobile ? "small" : "default"'
		:variant='buttonDisabled ? "outlined" : "flat"'
		@click='refresh'
	>
		<v-row align='center' class='ma-0 pa-0' justify='space-around'>
			<v-col class='ma-0 pa-0' cols='auto'>
				<v-icon class='mr-1' color='' :icon='mdiRefresh' />
			</v-col>
			<v-col class='ma-0 pa-0 mono-numbers' cols='auto'>
				{{ buttonText }}
			</v-col>
		</v-row>

	</v-btn>

</template>

<script setup lang="ts">
import { mdiRefresh } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { zeroPad } from '@/utils/zeropad'
const { mobile } = useDisplay()

const emit = defineEmits(['refresh'])

const props = defineProps<{ updateCount: number }>()

const buttonDisabled = computed(() => loading.value || updating.value)
const buttonText = computed(() => `next update ${zeroPad(props.updateCount)}`)
const loading = computed(() => loadingModule().loading)
const updating = computed(() => props.updateCount === 0)

function refresh (): void {
	if (loading.value) return
	emit('refresh')
}

</script>
