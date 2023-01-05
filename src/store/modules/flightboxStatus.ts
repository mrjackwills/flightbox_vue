import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';

export const flightboxStatusStore = defineStore(ModuleName.FLIGHTBOX_STATUS, {

	state: () => ({
		api_version: '',
		init: false,
		internal_ip: '',
		online: false,
		screen_on: false,
		uptime: 0,
		uptime_app: 0,
		uptime_ws: 0,
	}),

	actions: {
		set_api_version (su: string): void {
			this.api_version = su;
		},
		set_init (b: boolean): void {
			this.init = b;
		},
		set_internal_ip (su: string): void {
			this.internal_ip = su;
		},
		set_uptimeApp (nu: number): void {
			this.uptime_app = nu;
		},
		set_online (b: boolean): void {
			this.online = b;
		},
		set_screen_on (b: boolean): void {
			this.screen_on = b;
		},
		set_uptime (nu: number): void {
			this.uptime = nu;
		},
		set_uptime_ws (nu: number): void {
			this.uptime_ws = nu;
		},
	}
});
