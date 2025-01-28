import Router from "./Router"
import V1Router from '@/routes/API/V1'

const applicactionRouter = new Router()
applicactionRouter.use(V1Router.name, V1Router)

export default applicactionRouter