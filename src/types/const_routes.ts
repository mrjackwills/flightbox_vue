export const FrontendRoutes = {
	BASE: '/',
	LOGIN: '/login',
	CATCHALL: '/:pathMatch(.*)*'
} as const;

export type FrontendRoutes = (typeof FrontendRoutes)[keyof typeof FrontendRoutes];
