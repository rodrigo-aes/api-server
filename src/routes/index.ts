import Router from "./Router"
import V1Router from '@/routes/API/V1'

const applicactionRouter = new Router()

applicactionRouter.get('/ping', (req, res) => {
    res.json({ pong: true })
})

applicactionRouter.use(V1Router.name, V1Router)

export default applicactionRouter