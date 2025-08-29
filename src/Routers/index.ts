interface IRoute{
    baseURL: string;
}
interface IAdmin extends IRoute{
    auth: string;
    login: string;
}
interface IGeneral extends IRoute{
    patch: string;
    team: string;
}
interface ILowmen extends IRoute{}
interface IFullClear extends IRoute{
    fullClearStats: string;
}
interface IBenchmark extends IRoute{}
interface IRecruitment extends IRoute{}

interface IRouter{
    admin: IAdmin;
    general: IGeneral;
    lowmen: ILowmen;
    fullClear: IFullClear;
    benchmark: IBenchmark;
    recruitment: IRecruitment;
}

export const routing: IRouter = {
    admin:{
        baseURL: '/admin',
        auth: '/admin/auth',
        login: '/admin/login'
    },
    general: {
        baseURL: '/general',
        patch: '/general/patch',
        team: '/general/team'
    },
    lowmen: {
        baseURL: '/lowmen',
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