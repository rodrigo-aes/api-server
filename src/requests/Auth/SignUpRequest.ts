import Request, { type Handler } from "../Request"

import AuthController from "@/controllers/AuthController"
import { SignUpValidator } from "@/validation/Auth"

export default class SignUpRequest extends Request {
    protected handlers(): Handler[] {
        return [
            SignUpValidator,
            [AuthController, 'signUp']
        ]
    }
}