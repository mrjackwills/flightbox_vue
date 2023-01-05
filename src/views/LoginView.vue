<template>
	<section>
		<v-card-text>
			<v-row align='center' justify='center' class='ma-0 pa-0'>
				<v-col cols='12' md='9' lg='6' class='ma-0 pa-0'>
					<v-form
						v-on:submit.prevent
						method='post'
					>
						<v-text-field
							v-model='password'
							@click:append-inner='appendClick'
							@keydown.enter='login'
							:append-inner-icon='appendIcon'
							:disabled='loading'
							:prepend-inner-icon='mdiLock'
							:type='fieldType'
							autocomplete='password'
							id='password'
							label='password'
						/>
					</v-form>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-actions>
			<v-row align='center' justify='center' class='ma-0 pa-0'>
				<v-col cols='auto' class='ma-0 pa-0'>
					<v-btn
						@click='login'
						:disabled='buttonDisabled'
						color='primary'
						:variant='buttonDisabled ?"outlined":"flat"'
						rounded
					>
						login
				
					</v-btn>
				</v-col>
			</v-row>
		</v-card-actions>
	</section>
</template>

<script setup lang='ts'>
import { axiosRequests } from '@/services/axios';
import { mdiEye, mdiEyeOff, mdiLock } from '@mdi/js';
import { useRouter } from 'vue-router';
import { snackReset } from '@/services/snack';
import { FrontendRoutes } from '@/types/enum_routes';
const loadingStore = loadingModule();
const router = useRouter();

const buttonDisabled = computed((): boolean => {
	return loading.value || !password.value;
});

const appendIcon = computed((): string => {
	return passwordVisible.value ? mdiEyeOff: mdiEye;
});
const fieldType = computed((): string => {
	return passwordVisible.value ? 'text' : 'password';
});
const loading = computed({
	get: function (): boolean {
		return loadingStore.loading;
	},
	set: function (b: boolean): void {
		loadingStore.set_loading(b);
	}
});
const password = ref('');
const passwordVisible = ref(false);
const appendClick = (): void => {
	if (loading.value) return;
	passwordVisible.value = !passwordVisible.value;
};
		
const login = async (): Promise<void> => {
	if (!password.value) return;
	passwordVisible.value = false;
	loading.value = true;
	const response = await axiosRequests.wsAuth_post(password.value);
	// eslint-disable-next-line require-atomic-updates
	password.value = '';
	loading.value = false;
	if (response) {
		snackReset();
		router.push(FrontendRoutes.BASE);
	}
};
</script>