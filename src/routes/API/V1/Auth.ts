import Router from "@/routes/Router"
import {
    SignInRequest,
    SignUpRequest,
    RefreshRequest,
    LogoutRequest,
    AuthenticatedRequest
} from "@/requests/Auth"

const router = new Router()

router.post('/signin', SignInRequest)
router.get('/authenticated', AuthenticatedRequest)
router.post('/signup', SignUpRequest)
router.get('/refresh', RefreshRequest)
router.delete('/logout', LogoutRequest)

export default router