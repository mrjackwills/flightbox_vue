<template>

	<v-col class='ma-0 pa-0' cols='12'>

		<v-row align='center' class='ma-0 pa-0' justify='center'>

			<v-col class='ma-0 pa-0' cols='auto'>

				<v-row align='center' class='pulse-animation' justify='space-between' no-gutters>

					<v-col class='ma-0 pa-0' cols='auto'>
						<v-icon
							class='mr-1'
							color='danger'
							dense
							:icon='mdiAlertCircle'
							:size='mobile ? `small` : `default`'
						/>
					</v-col>

					<v-col class='ma-0 pa-0' cols='auto'>
						<span class='text-danger text-h5'>flightbox offline</span>
					</v-col>

				</v-row>

			</v-col>

		</v-row>
	</v-col>

</template>

<script setup lang='ts'>
import { mdiAlertCircle } from '@mdi/js'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

</script>
