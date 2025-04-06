export const FrontendRoutes =  {
	BASE: '/' as const,
	LOGIN: '/login' as const,
	CATCHALL: '/:pathMatch(.*)*' as const
};

export type FrontendRoutes = (typeof FrontendRoutes)[keyof typeof FrontendRoutes]; 