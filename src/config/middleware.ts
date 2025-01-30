import type { MiddewaresConfig } from "@/types/config"

// Global Middlewares
import MaxRequestsLimit from "@/middlewares/MaxRequestsLimit"

const middlewareConfig: MiddewaresConfig = {
    global: [
        MaxRequestsLimit
    ]
}

export default middlewareConfig