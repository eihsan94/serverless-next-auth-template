import { getSession } from "next-auth/client"

const redirectHome = async(context: any, otherProps?: any) => {
    const session = await getSession({req: context.req})
    return session 
        ? {
            redirect: {
            destination:'/',
            permanent: false,
            }
        }
        : {
            props: {session}
        }
}

const redirectAuth = async(context: any, otherProps?: any) => {
    const session = await getSession({req: context.req})
    const props = {session, ...otherProps}
    return session 
        ? {props}
        : {
            redirect: {
            destination:'/auth',
            permanent: false,
            },
        }
}


export  {
    redirectAuth,
    redirectHome,
}
