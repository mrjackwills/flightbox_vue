export const ModuleName =  {
	AIRCRAFT: 'aircraft' as const,
	DIALOG: 'dialog' as const,
	FLIGHTBOX_STATUS: 'flightboxStatus' as const,
	IMAGE: 'image' as const,
	LOADING: 'loading' as const,
	SETTINGS: 'settings' as const,
	SNACKBAR: 'snackbar' as const,
	USER: 'user' as const,
	WEBSOCKET: 'websocket' as const
};

export type ModuleName = (typeof ModuleName)[keyof typeof ModuleName]; 