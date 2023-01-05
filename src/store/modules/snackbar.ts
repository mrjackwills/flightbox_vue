import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';

export const snackbarStore = defineStore(ModuleName.SNACKBAR, {

	state: () => ({
		icon: '',
		loading: false,
		message: '',
		timeout: 0,
		visible: false,
	}),

	actions: {
		set_icon (su: string): void {
			this.icon = su;
		},
		
		set_loading (b: boolean): void {
			this.loading = b;
		},
		
		set_message (su: string): void {
			this.message = su;
		},
		
		set_timeout (nu: number): void {
			this.timeout = nu;
		},
		
		set_visible (b: boolean): void {
			this.visible = b;
		},

	}
});
