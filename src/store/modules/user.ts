import { aircraftStore } from './aircraft';
import { defineStore } from 'pinia';
import { dialogStore } from './dialog';
import { flightboxStatusStore } from './flightboxStatus';
import { loadingStore } from './loading';
import { ModuleName } from '@/types/enum_module';
import { snackError } from '@/services/snack';
import { websocketStore } from './websocket';
// import { useRoute, useRouter } from 'vue-router';
import { getActivePinia } from 'pinia';
import { FrontendRoutes } from '@/types/enum_routes';

export const userStore = defineStore(ModuleName.USER, {
	
	state: () => ({
		authenticated: false,
	}),
	
	actions: {
		logout (message?: string): void {
			this.authenticated = false;
			loadingStore().set_loading(false);
			flightboxStatusStore().$reset();
			aircraftStore().$reset();
			websocketStore().closeWS();
			dialogStore().$reset();
			if (message) snackError({ message });
			getActivePinia()?.router().push(FrontendRoutes.LOGIN);
		},
		
		set_authenticated (value: boolean) {
			this.authenticated = value;
		},
		
	}
});
