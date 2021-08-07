import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

console.log(process.env.LINE_CLIENT_ID, process.env.LINE_CLIENT_SECRET);

const options  = {
    providers: [
        Providers.LINE({
            clientId: process.env.LINE_CLIENT_ID,
            clientSecret: process.env.LINE_CLIENT_SECRET,
        }),
        // Providers.Instagram({
        //     clientId:'',
        //     clientSecret: '',
        // }),
        // Providers.Google({
        //     clientId:'',
        //     clientSecret: '',
        // }),
        // Providers.Email({
        //     server: {
        //         host: '',
        //         port: '',
        //         auth: {
        //             user: '',
        //             pass: '',
        //         },
        //         form: '',
        //     }
        // })
    ]
}

const NextAuthApi = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)
export default NextAuthApi