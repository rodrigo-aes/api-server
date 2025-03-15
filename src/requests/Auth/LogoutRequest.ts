import Request, { type Handler } from "../Request"

import AuthController from "@/controllers/AuthController"
import { Authenticated } from "@/middlewares/Authenticated"

export default class LogoutRequest extends Request {
    protected handlers(): Handler[] {
        return [
            Authenticated,
            [AuthController, 'logout']
        ]
    }
}