import type { AxiosError, AxiosInstance } from 'axios'
import Axios from 'axios'
import { snackError, snackReset } from '@/services/snack'
import { websocketModule } from '@/stores/websocket'
import { env } from '@/utils/env'

// Some kind of dirty work around for strict axios typing?
type ErrorData = { data: { response: number } }

/// Generic error handling, ideally would use a decorator, but nuxt isn't happy
function error_block (error: unknown) {
	const e = error as AxiosError
	const user_store = userModule()
	const websocket_store = websocketModule()
	if (e.message === 'offline') {
		snackError({ message: 'server offline' })
	} else if (e.response?.status === 429) {
		const error_response = e.response.data as ErrorData
		const converted = Math.ceil(error_response.data.response / 1000)
		const message = `too many requests - please try again in ${converted} seconds `
		snackError({ message })
	} else {
		if (user_store.authenticated) {
			user_store.logout()
		}
		websocket_store.closeWS()
		snackError({ message: 'authentication error' })
	}
}

class AxiosRequests {
	#wsAuthAxios!: AxiosInstance

	constructor (wsAuthUrl: string) {
		this.#wsAuthAxios = Axios.create({
			baseURL: wsAuthUrl,
			withCredentials: false,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-control': 'no-cache',
			},
		})
		this.#wsAuthAxios.interceptors.response.use(config => Promise.resolve(config), error => error.response ? Promise.reject(error) : Promise.reject(new Error('offline')))
	}

	// This doesn't work in nuxt?
	// @wrap
	async wsAuth_post (password: string): Promise<boolean> {
		try {
			const { data } = await this.#wsAuthAxios.post('', {
				key: env.api_key,
				password,
			})
			if (data.response) {
				snackReset()
				const user_store = userModule()
				const websocket_store = websocketModule()
				user_store.set_authenticated(true)
				websocket_store.openWs(data?.response)
			}
			return !!data.response
		} catch (error) {
			error_block(error)
			return false
		}
	}
}

export const axiosRequests = new AxiosRequests(env.domain_token)
