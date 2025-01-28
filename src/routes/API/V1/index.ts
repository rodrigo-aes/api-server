import Router from "@/routes/Router"

const router = new Router('v1')

router.get('/ping', (req, res) => {
    return res.json({ pong: true })
})

export default router