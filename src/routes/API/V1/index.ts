import Router from "@/routes/Router"
import {
    SignInRequest,
    SignUpRequest,
    RefreshRequest,
    LogoutRequest
} from "@/requests/Auth"


const router = new Router('v1')

router.get('/ping', (_, res) => {
    return res.json({ pong: true })
})

router.prefix('/auth', router => {
    router.post('/signin', SignInRequest)
    router.post('/signup', SignUpRequest)
    router.get('/refresh', RefreshRequest)
    router.delete('/logout', LogoutRequest)
})



export default router