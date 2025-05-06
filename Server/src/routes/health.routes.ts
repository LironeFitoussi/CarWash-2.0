import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send('Test route working successfully')
})

export default router
