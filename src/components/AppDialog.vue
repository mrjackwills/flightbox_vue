<template>
	<v-dialog :max-width='maxWidth' v-model='visible' opacity='.55' scroll-strategy='close' width='100%' eager>
		<v-card v-intersect='onIntersect' color='grey-darken-3' class='elevation-0'>
			<v-img :src='imgSrc' width='100%' :max-height='maxHeight' contain class='mt-1' />
			<v-row align='center' :justify='smAndDown ? "center" : "space-between"' class='pa-0 ma-0 grey-darken-3'
				:class='titlePadding'>
				<v-col cols='12' md='auto' class='ma-0 pa-0 white--text' :class='{ titleSize, "text-center": mobile }'>
					{{ title }}
				</v-col>
				<v-col cols='auto' class='pa-0 ma-0'>
					<v-btn @click='close' :size='smAndDown ? `x-small` : `default`' class='fab-fix elevation-0 my-2'
						color='secondary' dark rounded>
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
import { useDisplay } from 'vuetify';
const { mobile, smAndDown } = useDisplay();

const dialogStore = dialogModule();

const imgSrc = computed(() => dialogStore.imgSrc);
const maxWidth = computed(() => mobile.value ? '95vw' : '65vw');
const maxHeight = computed(() => mobile.value ? '80vh' : '50vh');
const title = computed(() => dialogStore.title ?? 'warning');
const titlePadding = computed(() => mobile.value ? 'px-1' : 'px-6');
const titleSize = computed(() => mobile.value ? 'text-h7' : 'text-h6');

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
const onIntersect = (entries: Array<IntersectionObserverEntry>): void => {
	isIntersecting.value = !!entries[0]?.isIntersecting;
};

watch(isIntersecting, (i: boolean) => {
	if (!i) dialogStore.$reset();
});
</script>
