const Router = require('express')

const router = Router()

router.get('/ping', (_req: any, res: { send: (arg0: string) => void }) => {
  res.send('pong')
})

export default router
