import dotenvx from '@dotenvx/dotenvx'

/**
 * Define application environment files
 */
class Environment {
    private workspaces: string[]

    constructor () {
        this.workspaces = this.defineWorkspaces()
        this.applyConfig()
    }

    // ======================================================================== 

    private applyConfig () {
        dotenvx.config({
            path: [
                '.env',
                `.env.${process.env.NODE_ENV || 'production'}`,
                ...this.workspaces
            ]
        })
    }

    // ======================================================================== 

    private defineWorkspaces () {
        if (process.env.WORKSPACES) return process.env.WORKSPACES
            .split('|')
            .map(workspace => `.env.${workspace}`)

        return []
    }
}

export default Environment