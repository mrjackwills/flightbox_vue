import type { AxiosError, AxiosInstance } from 'axios'
import Axios from 'axios'
import { env } from '@/vanillaTS/env'
import { snackError, snackReset } from './snack'

// Some kind of dirty work around for strict axios typing?
type ErrorData = { data: { response: number } }

// TODO fix this

function wrap (value: any, _context: ClassMethodDecoratorContext) {
	const original = value
	async function wrapped (this: any, ...args: any[]) {
		try {
			return await original.apply(this, args)
		} catch (error) {
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
	}
	return wrapped
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

	@wrap
	async wsAuth_post (password: string): Promise<boolean> {
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
	}
}

export const axiosRequests = new AxiosRequests(env.domain_token)
