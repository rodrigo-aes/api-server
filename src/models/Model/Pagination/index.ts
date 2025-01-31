import RequestContext from "@/contexts/RequestContext"
import type { Request } from "express"

export default class Pagination {
    public total: number
    public page: number
    public perPage: number
    public pages: number
    public prevPage: number | null
    public nextPage: number | null
    public links: string[]

    constructor(
        total: number,
        page: number,
        perPage: number
    ) {
        this.total = total
        this.page = page
        this.perPage = perPage
        this.pages = this.calcTotalPages()
        this.prevPage = this.calcPrevPage()
        this.nextPage = this.calcNextPage()
        this.links = this.handleLinks()
    }

    // Public Methods =========================================================
    public toJSON() {
        return {
            total: this.total,
            page: this.page,
            pages: this.pages,
            perPage: this.perPage,
            prevPage: this.prevPage,
            nextPage: this.nextPage,
            links: this.links
        }
    }

    // Private Methods ========================================================
    private calcTotalPages() {
        return Math.ceil(this.total / this.perPage)
    }

    // ------------------------------------------------------------------------

    private calcPrevPage(): number | null {
        const prev = this.page - 1
        return prev >= 1 ? prev : null
    }

    // ------------------------------------------------------------------------=

    private calcNextPage(): number | null {
        const next = this.page + 1

        return next <= this.pages
            ? next
            : null
    }

    // ------------------------------------------------------------------------

    private handleLinks(): string[] {
        const req = RequestContext.req as Request
        const original = `${req.protocol}://${req.get('host')}${req.originalUrl}`

        const links: string[] = []
        for (let i = 1; i <= this.pages; i++) {
            const url = new AppURL(original)
            url.searchParams.set('page', i.toString())

            links.push(url.toString())
        }

        return links
    }
}