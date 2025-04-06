<template>
	<v-row class='ma-0 pa-0' :class='my' align='center' justify='center' no-gutters>
		<v-col :cols='`${cols}`' class='ma-0 pa-0'>
			<v-divider />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>

withDefaults(defineProps<{
	cols?: number;
	my?: string;
}>(), {
	cols: 12,
	my: 'my-1'
});

</script>