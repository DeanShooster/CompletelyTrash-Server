interface IUserRoutes{
    baseURL: string;
    fullClearStats: string;
}

interface IRouter{
    fullClear: IUserRoutes;
}

export const routing: IRouter = {
    fullClear: {
        baseURL: '/fullclear',
        fullClearStats: '/fullclear/stats',
    }
};