import type { Request, Response, NextFunction } from "express"

// Contexts
import RequestContext from "@/contexts/RequestContext";

// Types
import type { AnyZodObject, ZodEffects } from "zod";
import type { ValidationTarget, ValidatorConstructor } from "./types";

abstract class Validator {
    private _schema: AnyZodObject | ZodEffects<AnyZodObject>
    protected abstract target: ValidationTarget
    protected abstract key: string

    constructor(
        protected req: Request,
        protected res: Response,
        protected next: NextFunction
    ) {
        this._schema = this.schema()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Use validator request handler to parse request data
     * @returns {Promise<void | Response>} - Returns next function case request
     * data is valid and a `422` response case invalid
     */
    public async handle(): Promise<void | Response> {
        const values = this.req[this.target]

        const { success, data, error } = await this._schema.spa(values)

        if (success) {
            this.req.validated[this.key] = data
            return this.next()
        }

        return this.res.status(422).json({ errors: error?.format() })
    }

    // ------------------------------------------------------------------------

    /**
     * Parse values and return result
     * 
     * @param {any} values - Values to validate 
     * @returns {Promise<[boolean, any]>} - A promise with tuple `success`
     * boolean and parsed `data` or validation errors
     */
    public async parse(values?: any): Promise<[boolean, any]> {
        if (!values) values = this.req[this.target]

        const { success, data, error } = await this._schema.spa(values)
        return [success, success ? data : error.format()]
    }

    // ------------------------------------------------------------------------

    /**
     * Merge the current intance schema with the schemas of one or more 
     * validators
     * 
     * @param {ValidatorConstructor[]} validators - Valiidators to merge schema
     */
    public merge(...validators: ValidatorConstructor[]) {
        for (const validator of validators) {
            const instance = new validator(
                this.req,
                this.res,
                this.next
            )

            this._schema = (this._schema as AnyZodObject).merge(
                instance.schema() as AnyZodObject
            )
        }
    }

    // Protecteds -------------------------------------------------------------
    /**
     * Schema to parse data
     */
    protected abstract schema(): AnyZodObject | ZodEffects<AnyZodObject>

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Merge the schemas of tow or more validators
     * 
     * @param {ValidatorConstructor} validator - Main validator
     * @param {ValidatorConstructor[]} validators - Merge validators
     * @returns {Validators} - A instance of main validators with the merged
     * schema
     */
    public static merge(
        validator: ValidatorConstructor,
        ...validators: ValidatorConstructor[]
    ): Validator {
        const { req, res, next } = RequestContext

        const instance = new validator(req, res, next)
        instance.merge(...validators)

        return instance
    }

    // ------------------------------------------------------------------------

    /**
     * 
     * @param {any} values - Values to parse, case undefined validator assumes
     * the values on target 
     * @returns {Promise<[boolean, any]>} - A promise with tuple `success`
     * boolean and parsed `data` or validation errors
     */
    static parse(this: ValidatorConstructor, values?: any): Promise<
        [boolean, any]
    > {
        const { req, res, next } = RequestContext;
        const instance = new this(req, res, next);
        return instance.parse(values)
    }
}

export default Validator

export type {
    ValidationTarget,
    ValidatorConstructor
}