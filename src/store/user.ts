import { defineStore, getActivePinia } from 'pinia'
import { snackError, snackReset } from '@/services/snack'
import { FrontendRoutes, ModuleName } from '@/types'
import { aircraftModule } from './aircraft'
import { dialogModule } from './dialog'
import { flightboxStatusModule } from './flightboxStatus'
import { loadingModule } from './loading'
import { websocketModule } from './websocket'

export const userModule = defineStore(ModuleName.USER, {

	state: () => ({ authenticated: false }),

	actions: {
		logout (message?: string): void {
			this.authenticated = false
			loadingModule().set_loading(false)
			flightboxStatusModule().$reset()
			aircraftModule().$reset()
			websocketModule().closeWS()
			dialogModule().$reset()
			if (message) {
				snackReset()
				snackError({ message })
			}
			getActivePinia()?.router().push(FrontendRoutes.LOGIN)
		},

		set_authenticated (value: boolean) {
			this.authenticated = value
		},
	},
})
