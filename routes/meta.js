import { Router } from 'express'
import { MetaProvider } from '../MetaProvider.js'

const router = Router();

/** 
 * Fetch site metadata by url
 * @route GET /v1/meta/[url]
 * @version 1
 */
router.get('/v1/meta', async (req, res) => {
   let provider, data = {};
   const query = req.query;

   if (!('url' in query)) {
      return res.status(400).json({
         statusCode: 400,
         message: "Missing url query parameter"
      });
   }

   provider = new MetaProvider(query.url);

   try {
      await provider.load();

      data = provider.toObject();
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         statusCode: 500,
         message: error.message
      });
   }

   return res.status(200).json({
      statusCode: 200,
      message: "Metadata successfully fetched",
      result: data
   });
})

/** 
 * Fetch global site metadata
 * @route POST /meta
 * @version 1
 */
router.post('/v1/meta', async (req, res) => {
   const body = req.body;
   let provider;
   let data = {};

   if (!('url' in body)) {
      return res.status(400).json({
         statusCode: 400,
         message: "Missing url property"
      });
   }

   provider = new MetaProvider(body.url);

   try {
      await provider.load();

      data = provider.toObject();
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         statusCode: 500,
         message: error.message
      });
   }

   return res.status(200).json({
      statusCode: 200,
      message: "Metadata successfully fetched",
      result: data
   });
});

export default router;
