import { Router } from 'express'
import metaRouter from './meta.js'

const router = Router();

router.use('/v1/meta', metaRouter);

/** 
 * Testing endpoint
 * @route GET /test
 */
router.get('/test', (req, res) => {
   return res.status(200).json({
      message: "It's work 👍"
   })
})

router.use((req, res) => {
   return res.status(404).json({
      statusCode: 404,
      message: "Not found"
   })
})

export default router;
