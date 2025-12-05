<template>
	<v-row
		align='center'
		class='fill-height '
		justify='center'
		no-gutters
	>
		<v-col class='' cols='auto'>
			<v-row
				align='center'
				class=' mb-4'
				justify='center'
				no-gutters
			>
				<v-col class=' text-h1' cols='auto'>
					Error <span v-if='is404'>404</span>
				</v-col>
			</v-row>
			<v-row
				align='center'
				class='mb-4'
				justify='center'
				no-gutters
			>
				<v-col class=' text-h5' cols='auto'>
					{{ text }}
				</v-col>
			</v-row>
			<v-row
				align='center'
				class=''
				justify='center'
				no-gutters
			>
				<v-col class='' cols='auto'>
					<NuxtLink to='/'>return to home page</NuxtLink>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
const pageTitle = 'error page'

const props = withDefaults(defineProps<{
	is404?: boolean
}>(), {
	is404: false,
})

const text = computed(() => {
	return props.is404 ? 'Unknown Page' : 'Something has gone wrong'
})

onMounted(() => {
	browserModule().set_description(pageTitle)
	browserModule().set_title(pageTitle)
})

</script>
