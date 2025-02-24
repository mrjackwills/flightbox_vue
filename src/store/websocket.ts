import { defineStore } from 'pinia';
import { ModuleName } from '@/types/const_module';
import { userModule } from './user';

import type { TWSToServer } from '@/types';
import { ws } from '@/services/WS';

export const websocketModule = defineStore(ModuleName.WEBSOCKET, {

	state: () => ({ connected: false }),

	actions: {

		closeWS (): void {
			this.set_connected(false);
			ws.closeWs();
		},

		openWs (password: string): void {
			const user_store = userModule();
			if (!user_store.authenticated) return;
			ws.openWs(password);
			ws.connection?.addEventListener('open', () => {
				this.set_connected(true);
			});
		},

		send (data: TWSToServer): void {
			ws.connection?.send(JSON.stringify({
				data,
				unique: true 
			}));
		},
		
		set_connected (b: boolean): void {
			this.connected = b;
		}
		
	}
});
