import { aircraftModule } from './aircraft';
import { defineStore } from 'pinia';
import { dialogModule } from './dialog';
import { flightboxStatusModule } from './flightboxStatus';
import { loadingModule } from './loading';
import { ModuleName } from '@/types/enum_module';
import { snackError, snackReset } from '@/services/snack';
import { websocketModule } from './websocket';
// import { useRoute, useRouter } from 'vue-router';
import { getActivePinia } from 'pinia';
import { FrontendRoutes } from '@/types/enum_routes';

export const userModule = defineStore(ModuleName.USER, {
	
	state: () => ({
		authenticated: false,
	}),
	
	actions: {
		logout (message?: string): void {
			this.authenticated = false;
			loadingModule().set_loading(false);
			flightboxStatusModule().$reset();
			aircraftModule().$reset();
			websocketModule().closeWS();
			dialogModule().$reset();
			if (message) {
				snackReset();
				snackError({ message });
			}
			getActivePinia()?.router().push(FrontendRoutes.LOGIN);
		},
		
		set_authenticated (value: boolean) {
			this.authenticated = value;
		},
		
	}
});
