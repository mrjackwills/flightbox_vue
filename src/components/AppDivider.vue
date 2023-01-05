<template>
	<v-row class='ma-0 pa-0' :class='my' align='center' justify='center' no-gutters>
		<v-col :cols='`${cols}`' class='ma-0 pa-0'>
			<v-divider  />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>

defineProps({
	cols: {
		type: Number,
		default: 12
	},
	my: {
		type: String,
		default: 'my-1'
	}
});
</script>