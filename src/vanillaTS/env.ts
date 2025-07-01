class Env {
	readonly #api_key = String(import.meta.env.VITE_APP_APIKEY);

	readonly #app_version = String(import.meta.env.VERSION);

	readonly #domain_token = String(import.meta.env.VITE_APP_TOKEN_DOMAIN);

	readonly #domain_wss = String(import.meta.env.VITE_APP_WSS_DOMAIN);

	readonly #build_date = new Date(import.meta.env.BUILD_DATE);

	readonly #homepage = String(import.meta.env.VITE_GITHUB_HOMEPAGE);

	readonly #mode_production = import.meta.env.PROD;

	get api_key (): string {
		return this.#api_key;
	}

	get app_version (): string {
		return this.#app_version;
	}

	get build_date (): string {
		return this.#build_date.toISOString();
	}

	get domain_token (): string {
		return this.#domain_token;
	}

	get domain_wss (): string {
		return this.#domain_wss;
	}

	get homepage (): string {
		return this.#homepage;
	}

	get mode_production (): boolean {
		return this.#mode_production;
	}
}

export const env = new Env();
