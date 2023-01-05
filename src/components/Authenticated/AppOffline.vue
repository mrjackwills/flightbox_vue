<template>
		
	<v-col cols='12' class='ma-0 pa-0'>
		
		<v-row align='center' justify ='center' class='ma-0 pa-0'>

			<v-col cols='auto' class='ma-0 pa-0'>

				<v-row justify='space-between' align='center' no-gutters class='pulse-animation'>

					<v-col cols='auto' class='ma-0 pa-0'>
						<v-icon dense color='white' class='mr-1'  :size='mobile?`small`:`default`' :icon='mdiAlertCircle' />
					</v-col>

					<v-col cols='auto' class='ma-0 pa-0' >
						<span class='white--text' >flightbox offline</span>
					</v-col>
						
				</v-row>

			</v-col>
		
		</v-row>
	</v-col>
		
</template>

<script setup lang='ts'>
import { mdiAlertCircle } from '@mdi/js';
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

</script>