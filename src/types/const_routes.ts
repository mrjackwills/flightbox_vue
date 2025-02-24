export const FrontendRoutes =  {
	BASE: '/',
	LOGIN: '/login',
	CATCHALL: '/:pathMatch(.*)*'
};
	
export type FrontendRoutes = (typeof FrontendRoutes)[keyof typeof FrontendRoutes]; 