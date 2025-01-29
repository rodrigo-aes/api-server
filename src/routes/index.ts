import Router from "./Router"
import V1Router from '@/routes/API/V1'

const applicactionRouter = new Router()

// Routers
applicactionRouter.use(V1Router.name, V1Router)

// Ping
applicactionRouter.get('/ping',
    (req, res) => res.json({ pong: true })
)

export default applicactionRouter