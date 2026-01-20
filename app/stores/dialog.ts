import { defineStore } from 'pinia'
import { StoreName } from '@/types'

export const dialogModule = defineStore(StoreName.DIALOG, {

	state: () => ({
		imgSrc: '',
		timeout: 0,
		title: '',
		visible: false,
	}),

	actions: {

		set_imgSrc (x: string): void {
			this.imgSrc = x
		},

		set_timeout (x: number): void {
			this.timeout = x
		},

		set_title (x: string): void {
			this.title = x
		},

		set_visible (x: boolean): void {
			this.visible = x
		},
	},
})
