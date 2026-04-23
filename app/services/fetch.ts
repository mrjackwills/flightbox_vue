import { env } from '@/utils/env'
import { snackError, snackReset } from './snack'

type ErrorData = { data: { response: number } }

/// Generic error handling, ideally would use a decorator, but nuxt isn't happy
function error_block (error: unknown) {
	const user_store = userModule()
	const websocket_store = websocketModule()
	const e = error as Error & { status?: number, data?: unknown }

	if (e.message === 'offline') {
		snackError({ message: 'server offline' })
	} else if (e.status === 429) {
		const error_response = e.data as ErrorData
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

class FetchRequests {
	#baseURL: string
	#defaultHeaders: HeadersInit

	constructor () {
		this.#baseURL = env.domain_token
		this.#defaultHeaders = {
			Accept: 'application/json',
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-cache',
		}
	}

	async wsAuth_post (password: string): Promise<boolean> {
		try {
			const data = await this.#post<{ response: string }>('', {
				key: env.api_key,
				password,
			})
			if (data && data.response) {
				snackReset()
				const user_store = userModule()
				const websocket_store = websocketModule()
				user_store.set_authenticated(true)
				websocket_store.openWs(data?.response)
				return true
			}
			return false
		} catch (error) {
			error_block(error)
			return false
		}
	}

	async parse_json (res: Response) {
		try {
			return await res.json()
		} catch {
			return null
		}
	}

	async #post<T>(path: string, body: unknown): Promise<T | null> {
		let response: Response

		try {
			response = await fetch(`${this.#baseURL}${path}`, {
				method: 'POST',
				headers: this.#defaultHeaders,
				body: JSON.stringify(body),
			})
		} catch {
			throw new Error('offline')
		}

		if (!response.ok) {
			const data = await this.parse_json(response)
			const error = Object.assign(new Error(response.statusText), {
				status: response.status,
				data,
			})
			throw error
		}

		return await this.parse_json(response)
	}
}

export const fetchRequests = new FetchRequests()
