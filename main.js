import { App } from './App.js'
import { onProd } from './utils.js'
import router from './routes/index.js'

async function boot() {
   const app = new App();
   const prod = onProd();
   let port;

   // load server port from .env
   if (!prod) {
      (await import('dotenv')).config();
   }

   port = Number(process.env.PORT);

   app.route('/', router);

   app
      .start(port)
      .on('listening', () => {
         if (!prod) {
            process.stdout.write(`Server is running on port ${port}\n`)
         }
      })
}

boot();
