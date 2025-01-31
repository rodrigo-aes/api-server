import type { MiddewareConfig } from "@/types/config"

// Global Middlewares
import MaxRequestsLimit from "@/middlewares/MaxRequestsLimit"

const middlewareConfig: MiddewareConfig = {
    global: [
        MaxRequestsLimit
    ]
}

export default middlewareConfig