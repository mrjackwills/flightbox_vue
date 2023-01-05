<template>
	<v-dialog
		:max-width='maxWidth'
		v-model='visible'
		overlay-opacity='1'
		scroll-strategy='close'
		width='100%'
		eager
	>
		<v-card v-intersect='onIntersect' color='primary' class='elevation-0'>
			<v-img :src='imgSrc' width='100%' max-height='80vh' contain class='mt-4'/>
			<v-row align='center' justify='space-between' class='pa-0 ma-0 primary' :style='`background-color:${primary_color}`' :class='titlePadding'>
				<v-col cols='auto' md='auto' class='ma-0 pa-0 white--text' :class='{titleSize, "text-center": mobile}'>
					{{ title }}
				</v-col>
				<v-col cols='auto' class='pa-0 ma-0'>
					<v-btn
						@click='close'
						:size='mobile ? `small`:`default`'
						class='fab-fix elevation-0 my-2'
						color='secondary'
						dark
						rounded
					>
						<v-icon small :icon='mdiClose' />
						close
					</v-btn>
				</v-col>
			</v-row>
		</v-card>
	</v-dialog>
</template>

<script setup lang='ts'>
import { mdiClose } from '@mdi/js';
import { useTheme, useDisplay } from 'vuetify';
const { mobile } = useDisplay();
const primary_color = useTheme().global.current.value.colors.primary;

const dialogStore = dialogModule();

const imgSrc = computed((): string => {
	return dialogStore.imgSrc;
});
const maxWidth = computed(() => {
	return mobile.value ? '95vw': '65vw';
});
const title = computed(() => {
	return dialogStore.title ?? 'warning';
});
const titlePadding = computed(() => {
	return mobile.value ? 'px-1' : 'px-6';
});
const titleSize = computed(() => {
	return mobile.value ? 'text-h7' : 'text-h6';
});
const visible = computed({
	get (): boolean {
		return dialogStore.visible;
	},
	set (b: boolean): void {
		dialogStore.set_visible(b);
	}
});

const close = (): void => {
	visible.value = false;
};

const isIntersecting = ref(false);
const onIntersect = (entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = !!entries[0]?.isIntersecting;
};

watch(isIntersecting, (i: boolean) => {
	if (!i) dialogStore.$reset();

});
</script>
