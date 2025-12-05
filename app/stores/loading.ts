import { defineStore } from 'pinia'
import { StoreName } from '@/types'

export const loadingModule = defineStore(StoreName.LOADING, {

	state: () => ({ loading: false }),

	actions: {
		set_loading (value: boolean) {
			this.loading = value
		},
	},
})
