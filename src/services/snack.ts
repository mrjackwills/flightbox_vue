import { mdiAlertCircle, mdiCheckCircleOutline } from '@mdi/js';
import type { TSnack } from '@/types';

export const snackSuccess = async ({ message = 'Success', icon = mdiCheckCircleOutline, timeout=5000, loading=false }: TSnack): Promise<void> => {
	const snackbar_store = snackbarModule();
	snackReset();
	await Promise.all([
		snackbar_store.set_icon(icon),
		snackbar_store.set_loading(loading),
		snackbar_store.set_message(message),
		snackbar_store.set_timeout(timeout),
		snackbar_store.set_visible(true),
	]);
};

export const snackError = async ({ message = 'error', icon = mdiAlertCircle, timeout=7500 }: TSnack): Promise<void> =>{
	const snackbar_store = snackbarModule();
	snackReset();
	await Promise.all([
		snackbar_store.set_icon(icon),
		snackbar_store.set_message(message),
		snackbar_store.set_timeout(timeout),
		snackbar_store.set_visible(true),
	]);
};

export const snackReset = ():void => {
	const snackbar_store = snackbarModule();
	snackbar_store.$reset();
};