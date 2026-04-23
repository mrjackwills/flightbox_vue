<template>
	<v-col class='text-center text-white text--body-1 mono-numbers' cols='12'>

		<section v-for='(row, index) in toDisplay' :key='index'>

			<v-row class='align-center justify-center ma-0 pa-0' density='compact'>

				<v-col
					v-for='(item, rowIndex) in row'
					:key='rowIndex'
					:class='{ "ml-1": rowIndex === 1 && mdAndUp }'
					cols='12'
					md='5'
				>

					<v-row class='align-center justify-space-between'>

						<v-col class='ma-0 pa-0' cols='auto'>
							<v-icon
								class='mr-1'
								color='primary'
								dense
								:icon='item.icon'
								:size='mobile ? `x-small` : `default`'
							/>
							<span class='text-white unselectable' :class='{ "small-text": mobile }'>{{ item.text
							}}:</span>
						</v-col>

						<v-col
							class='ma-0 pa-0'
							:class='{ "mr-1": rowIndex === 0 && mdAndUp, "cl": item.copy }'
							cols='auto'
						>

							<section v-if='item.copy'>
								<v-row
									class='text-white mono-numbers ma-0 pa-0 align-center justify-space-between'
									:class='{ "small-text": mobile }'
									@click='toCopy(item.value)'
								>
									<v-col class='ma-0 pa-0' cols='auto'>
										{{ item.value }}
									</v-col>
									<v-col class='ma-0 pa-0' cols='auto'>
										<v-icon
											id='ip_tool'
											class='ml-md-2 ml-1'
											:icon='mdiContentCopy'
											size='x-small'
										/>
										<span v-if='!online' class='text-danger'> [ cached ]</span>
									</v-col>
								</v-row>
								<v-tooltip
									v-if='showToolTip'
									activator='parent'
									content-class='tooltip'
									location='top center'
									:open-on-click='true'
									:open-on-hover='false'
								>
									<span>copied to clipboard</span>
								</v-tooltip>
							</section>
							<span v-else class='text-white mono-numbers unselectable' :class='{ "small-text": mobile }'>
								{{ item.value }} <span v-if='!online' class='text-danger'>[ cached ]</span>
							</span>
						</v-col>

					</v-row>

					<AppDivider v-if='rowIndex === 0 || index !== toDisplay.length - 1' class='hidden-md-and-up' my='' />

				</v-col>

			</v-row>

			<AppDivider v-if='index + 1 !== toDisplay.length' class='hidden-sm-and-down' />

		</section>
	</v-col>
</template>

<script setup lang="ts">
import type { TDataToDisplay } from '@/types'
import { mdiContentCopy } from '@mdi/js'
import { useClipboard } from '@vueuse/core'
import { useDisplay } from 'vuetify'

const { mobile, mdAndUp } = useDisplay()

onUnmounted(() => {
	clear()
})

const copyTimeout = ref(0)
const showToolTip = ref(false)

const online = computed(() => flightboxStatusModule().online)

function toCopy (value: string): void {
	showToolTip.value = true
	clear()
	useClipboard().copy(value)
	copyTimeout.value = window.setTimeout(() => {
		showToolTip.value = false
	}, 1250)
}

function clear (): void {
	clearTimeout(copyTimeout.value)
}

defineProps<{ toDisplay: TDataToDisplay }>()

</script>
