<template>
	<v-col cols='12' class='text-center text-white text--body-1 mono-numbers'>

		<section v-for='(row, index) in toDisplay' :key='index'>

			<v-row justify='space-between' align='center'  no-gutters>

				<v-col
					v-for='(item, rowIndex) in row'
					:key='rowIndex'
					cols='12'
					md='5'
					:class='{ "ml-1" : rowIndex === 1 && mdAndUp }'
				>

					<v-row justify='space-between' align='center' no-gutters>

						<v-col cols='auto' class='ma-0 pa-0'>
							<v-icon dense color='primary' class='mr-1' :size='mobile ? `x-small`:`default`' :icon='item.icon' />
							<span class='text-white unselectable' :class='{"small-text": mobile}'>{{ item.text }}:</span>
						</v-col>

						<v-col cols='auto' class='ma-0 pa-0' :class='{"mr-1" : rowIndex === 0 && mdAndUp, "cl": item.copy}' >
							
							<section v-if='item.copy'>
								<v-row  class='text-white mono-numbers ma-0 pa-0' :class='{"small-text": mobile}' @click='toCopy(item.value)' align='center' justify='space-between'>
									<v-col class='ma-0 pa-0' cols='auto'>
										{{ item.value }}
									</v-col>
									<v-col class='ma-0 pa-0' cols='auto'>
										<v-icon id='ip_tool' :size='mobile ? `x-small`:`small`' class='ml-md-2 ml-1' :icon='mdiContentCopy' />
										<span class='text-danger' v-if='!online'> [ cached ]</span>
									</v-col>
								</v-row>
								<v-tooltip v-if='showToolTip' :open-on-click='true' :open-on-hover='false' activator='parent' location='top center' content-class='tooltip'>
									<span>copied to clipboard</span>
								</v-tooltip>
							</section>
							<span v-else class='text-white mono-numbers unselectable' :class='{"small-text": mobile}'>
								{{ item.value }} <span class='text-danger' v-if='!online'>[ cached ]</span>
							</span>
						</v-col>
						
					</v-row>

					<AppDivider class='hidden-md-and-up' my='' v-if='rowIndex === 0 || index !== toDisplay.length -1' />

				</v-col>

			</v-row>
			
			<AppDivider v-if='index + 1 !== toDisplay.length' class='hidden-sm-and-down' />

		</section>
	</v-col>
</template>

<script setup lang="ts">
import { mdiContentCopy } from '@mdi/js';
import type { TDataToDisplay } from '@/types';
import { useClipboard } from '@vueuse/core';

import { useDisplay } from 'vuetify';

const { mobile, mdAndUp } = useDisplay();

onUnmounted(() => {
	clear();
});

const copyTimeout = ref(0);
const showToolTip = ref(false);

const online = computed((): boolean => {
	return flightboxStatusModule().online;
});

const toCopy = (value: string): void => {
	showToolTip.value = true;
	clear();
	useClipboard().copy(value);
	copyTimeout.value = window.setTimeout(() => {
		showToolTip.value = false;
	}, 1250);
};

const clear = (): void => {
	clearTimeout(copyTimeout.value);
};

defineProps<{ toDisplay: TDataToDisplay }>();

</script>