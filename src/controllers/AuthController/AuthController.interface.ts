import type { Request, Response } from 'express'
import type Controller from "@/controllers/Controller"


export interface AuthControllerInterface extends Controller {
    /**
     * Attempt to authenticate a user with credentials
     */
    signIn(req: Request, res: Response): Promise<Response>

    /**
     * Returns authenticated user
     */
    authenticated(req: Request, res: Response): Promise<Response>

    /**
     * Register and authenticate a user
     */
    signUp(req: Request, res: Response): Promise<Response>

    /**
     * Refresh auth instance
     */
    refresh(req: Request, res: Response): Promise<Response>

    /**
     * Remove current auth instance
     */
    logout(req: Request, res: Response): Promise<Response>
}