import type { Request, Response } from "express"
import type { AuthControllerInterface } from "./AuthController.interface"
import Controller from "@/controllers/Controller"


// Utils
import Auth from "@/utils/Auth"

// Models
import User from "@/models/User"

export default
    class AuthController
    extends Controller
    implements AuthControllerInterface {

    public async signIn(req: Request, res: Response) {
        const creds = req.validated.signIn
        const auth = await Auth.attempt(creds)

        if (auth) return res.json({
            user: Auth.user(),
            auth
        })

        return res.status(401).json({
            errors: {
                auth: 'Usuário e/ou senha incorretos.'
            }
        })
    }

    // ------------------------------------------------------------------------

    public async authenticated(req: Request, res: Response) {
        const source = Auth.sourceKey
        const authenticated = Auth.user()

        return res.json({
            source,
            authenticated
        })
    }

    // ------------------------------------------------------------------------

    public async signUp(req: Request, res: Response) {
        const data = req.validated.signUp
        const user = await User.register(data)
        const auth = await user.authenticate()

        return res.status(201).json({
            user,
            auth
        })
    }

    // ------------------------------------------------------------------------

    public async refresh(req: Request, res: Response) {
        const auth = await Auth.refresh()
        return res.json({ auth })
    }

    // ------------------------------------------------------------------------

    public async logout(req: Request, res: Response) {
        await Auth.logout()
        return res.json({ logout: true })
    }
}