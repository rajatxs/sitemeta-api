import { Router } from 'express'
import { MetaProvider } from '../MetaProvider.js'
import { toArray } from '../utils.js'

const router = Router();

/** Fetch site metadata */
router.use(async (req, res) => {
   let provider, payload, data = {};

   switch(req.method) {
      case 'GET':
         payload = req.query;
         payload.props = (typeof payload['props'] === 'string')? toArray(payload.props): [];
         break;

      case 'POST':
         payload = req.body;
         break
   }

   if (!('url' in payload)) {
      return res.status(400).json({
         statusCode: 400,
         message: "Missing url property"
      });
   }

   provider = new MetaProvider(payload.url);
   
   try {
      await provider.load();
      
      data = provider.resolveProps(payload.props || []);
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
