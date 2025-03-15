import type Validator from "."
import type { Request, Response, NextFunction } from "express"

export type ValidationTarget = 'body' | 'query' | 'params' | 'headers'

export type ValidatorConstructor = new (
    req: Request,
    res: Response,
    next: NextFunction
) => Validator