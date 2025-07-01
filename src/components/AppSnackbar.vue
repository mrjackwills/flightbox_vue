<template>
	<v-snackbar v-model='visible' id='snackbar' timeout='-1' app>
		<v-row justify='center' align='center' no-gutters class='ma-0 pa-0 unselectable'>
			<v-col v-if='icon' cols='auto' class=''>
				<v-icon color='danger' :icon='icon' />
			</v-col>
			<v-col v-if='loading' cols='auto' class=''>
				<v-progress-circular indeterminate :size='18' :width='3' color='danger' />
			</v-col>
			<v-col cols='auto' class='mx-3 ma-0 pa-0 danger--text'>
				{{ message }}
			</v-col>
		</v-row>
	</v-snackbar>

</template>

<script setup lang='ts'>

const snackbarStore = snackbarModule();

const icon = computed(() => snackbarStore.icon);
const loading = computed({
	get (): boolean {
		return snackbarStore.loading;
	},
	set (b: boolean): void {
		snackbarStore.set_loading(b);
	}
});
const message = computed({
	get (): string {
		return snackbarStore.message;
	},
	set (s: string): void {
		snackbarStore.set_message(s);
	}
});
const snackTimeout = computed({
	get (): number {
		return snackbarStore.timeout;
	},
	set (nu: number): void {
		snackbarStore.set_timeout(nu);
	}
});
const visible = computed({
	get (): boolean {
		return snackbarStore.visible;
	},
	set (b: boolean): void {
		snackbarStore.set_visible(b);
	}
});

const timeout = ref(0);

const closeSnackbar = (): void => {
	visible.value = false;
	snackbarStore.$reset();
	clearTimeout(timeout.value);
	timeout.value = 0;
};
watch(visible, (i) => {
	if (i && snackTimeout) timeout.value = window.setTimeout(() => {
		closeSnackbar();
	}, snackTimeout.value);
});
</script>

<style>
#snackbar {
	padding-bottom: 1.5rem !important;
}
</style>
