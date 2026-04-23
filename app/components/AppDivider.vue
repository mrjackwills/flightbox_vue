<template>
	<v-row
		class='ga-0 ma-0 pa-0 align-center justify-center'
		:class='my'
	>
		<v-col class='ma-0 pa-0' :cols='`${cols}`'>
			<v-divider />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>

withDefaults(defineProps<{
	cols?: number
	my?: string
}>(), {
	cols: 12,
	my: 'my-1',
})

</script>
