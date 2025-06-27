
interface IGeneral{
    baseURL: string;
    patch: string;
    team: string;
}

interface IUserRoutes{
    baseURL: string;
    fullClearStats: string;
}

interface IRouter{
    general: IGeneral;
    fullClear: IUserRoutes;
}

export const routing: IRouter = {
    general: {
        baseURL: '/general',
        patch: '/general/patch',
        team: '/general/team'
    },
    fullClear: {
        baseURL: '/fullclear',
        fullClearStats: '/fullclear/stats',
    }
};