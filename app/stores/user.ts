import { defineStore } from 'pinia'
import { snackError, snackReset } from '@/services/snack'
import { StoreName } from '@/types'
import { aircraftModule } from './aircraft'
import { dialogModule } from './dialog'
import { flightboxStatusModule } from './flightboxStatus'
import { loadingModule } from './loading'
import { websocketModule } from './websocket'

export const userModule = defineStore(StoreName.USER, {

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
		},

		set_authenticated (value: boolean) {
			this.authenticated = value
		},
	},
})
