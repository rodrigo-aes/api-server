import Request, { type Handler } from "../Request"

import AuthController from "@/controllers/AuthController"
import { SignInValidator } from "@/validation/Auth"

export default class SignInRequest extends Request {
    protected handlers(): Handler[] {
        return [
            SignInValidator,
            [AuthController, 'signIn']
        ]
    }
}