interface IRoute{
    baseURL: string;
}

interface IGeneral extends IRoute{
    patch: string;
    team: string;
}
interface IFullClear extends IRoute{
    fullClearStats: string;
}

interface IBenchmark extends IRoute{}

interface IRecruitment extends IRoute{}

interface IRouter{
    general: IGeneral;
    fullClear: IFullClear;
    benchmark: IBenchmark;
    recruitment: IRecruitment;
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
    },
    benchmark: {
        baseURL: '/benchmark',
    },
    recruitment:{
        baseURL: '/recruitment'
    }
};