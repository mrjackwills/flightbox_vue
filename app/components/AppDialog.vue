<template>
	<v-dialog
		v-model='visible'
		aria-modal='true'
		eager
		:max-width='maxWidth'
		opacity='.55'
		scroll-strategy='close'
		width='100%'
	>
		<v-card v-intersect='onIntersect' class='elevation-0' color='grey-darken-3'>
			<v-img
				class='mt-1'
				contain
				:max-height='maxHeight'
				:src='imgSrc'
				width='100%'
			/>
			<v-row
				class='pa-0 ma-0 grey-darken-3 align-center'
				:class='[titlePadding, smAndDown ? "justify-center" : "justify-space-between"]'
			>
				<v-col class='ma-0 pa-0 white--text text-headline-small' :class='{"text-center": mobile }' cols='12' md='auto'>
					{{ title }}
				</v-col>
				<v-col class='pa-0 ma-0' cols='auto'>
					<v-btn
						class='fab-fix elevation-0 my-2'
						color='secondary'
						dark
						rounded
						:size='smAndDown ? `x-small` : `default`'
						@click='close'
					>
						<v-icon :icon='mdiClose' small />
						close
					</v-btn>
				</v-col>
			</v-row>
		</v-card>
	</v-dialog>
</template>

<script setup lang='ts'>
import { mdiClose } from '@mdi/js'
import { useDisplay } from 'vuetify'
const { mobile, smAndDown } = useDisplay()

const dialogStore = dialogModule()

const imgSrc = computed(() => dialogStore.imgSrc)
const maxWidth = computed(() => mobile.value ? '95vw' : '65vw')
const maxHeight = computed(() => mobile.value ? '80vh' : '50vh')
const title = computed(() => dialogStore.title ?? 'warning')
const titlePadding = computed(() => mobile.value ? 'px-1' : 'px-6')

const visible = computed({
	get (): boolean {
		return dialogStore.visible
	},
	set (b: boolean): void {
		dialogStore.set_visible(b)
	},
})

function close (): void {
	visible.value = false
}

const isIntersecting = ref(false)
function onIntersect (entries: Array<IntersectionObserverEntry>): void {
	isIntersecting.value = !!entries[0]?.isIntersecting
}

watch(isIntersecting, (i: boolean) => {
	if (!i) dialogStore.$reset()
})
</script>
