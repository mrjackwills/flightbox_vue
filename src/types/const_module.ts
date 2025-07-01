export const ModuleName = {
	AIRCRAFT: 'aircraft',
	DIALOG: 'dialog',
	FLIGHTBOX_STATUS: 'flightboxStatus',
	IMAGE: 'image',
	LOADING: 'loading',
	SETTINGS: 'settings',
	SNACKBAR: 'snackbar',
	USER: 'user',
	WEBSOCKET: 'websocket'
} as const;

export type ModuleName = (typeof ModuleName)[keyof typeof ModuleName];
