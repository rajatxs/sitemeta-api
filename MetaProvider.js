import fetch from 'node-fetch'
import { isAbolute } from './utils.js'
import cheerio from 'cheerio'
import { URL } from 'url'

export class MetaProvider {
   #url = '';
   #content = '';

   /** @type {import('cheerio').CheerioAPI} */
   #html = null;

   /** @param {string} url */
   constructor(url) {
      if (!url) {
         throw new Error("Require site url");
      }

      this.#url = url;
      this.#html = null;
   }

   /** Fetch source code from specified url */
   async load() {
      let status;
      const response = await fetch(this.#url, {
         method: 'GET'
      });

      status = response.status;

      if (status > 400 && status < 600) {
         throw new Error("Couldn't get site data");
      }

      this.#content = await response.text();
      // console.log("START HTML", this.#html, this.#content);

      this.#html = cheerio.load(this.#content);
      console.log("END HTML", this.#html)
   }

   title() {
      console.log("HTML", this.#html)
      return (
         this.#html('title').text() ||
         this.#html("meta[name='apple-mobile-web-app-title']").attr('content')
      );
   }

   description() {
      return (
         this.#html("meta[name='description']").attr('content')
      );
   }

   thumb() {
      return (
         this.#html("meta[property='og:image']").attr('content')
      );
   }

   icon() {
      let icon = this.#html("link[rel='shortcut icon'], link[rel='icon shortcut'], link[rel='icon']").attr('href') || '';

      if (!isAbolute(icon)) {
         icon = new URL(icon, this.#url).href;
      }

      return icon;
   }

   toObject() {
      return {
         title: this.title(),
         description: this.description(),
         thumb: this.thumb(),
         icon: this.icon()
      }
   }
}
