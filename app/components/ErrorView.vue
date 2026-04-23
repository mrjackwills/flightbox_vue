<template>
	<v-row
		class='fill-height justify-center align-center'
	>
		<v-col class='' cols='auto'>
			<v-row
				class='mb-4 justify-center align-center'
			>
				<v-col class='text-display-large' cols='auto'>
					Error <span v-if='is404'>404</span>
				</v-col>
			</v-row>
			<v-row
				class='mb-4 justify-center align-center'
			>
				<v-col class=' text-headline-medium' cols='auto'>
					{{ text }}
				</v-col>
			</v-row>
			<v-row
				class='justify-center align-center'
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
