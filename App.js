import express from 'express'
import cors from 'cors'

export class App {
   /** @type {import('express').Express} */
   #app = null

   constructor() {
      this.#app = express();
      this.registerMiddlewares();
   }

   /** Register common app middlwares */
   registerMiddlewares() {
      this.#app.use(express.json({ limit: '5mb' }));
      this.#app.use(cors());
   }

   /**
    * Register new route
    * @param {string} path
    * @param {import('express').Router} router 
    */
   route(path, router) {
      this.#app.use(path, router)
   }

   /**
    * Start server
    * @param {number} port - Server port
    */
   start(port) {
      return this.#app.listen(port)
   }
}
