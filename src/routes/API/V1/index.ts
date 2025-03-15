import Router from "@/routes/Router"

// Routes
import AuthRouter from './Auth'

const router = new Router('v1')

router.get('/ping', (_, res) => {
    return res.json({ pong: true })
})

router.use('/auth', AuthRouter)

export default router