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

      this.#html = cheerio.load(this.#content);
   }

   _title_() {
      return (
         this.#html('title').text() ||
         this.#html("meta[name='apple-mobile-web-app-title']").attr('content')
      );
   }

   _description_() {
      return (
         this.#html("meta[name='description']").attr('content')
      );
   }

   _thumb_() {
      return (
         this.#html("meta[property='og:image']").attr('content')
      );
   }

   _icon_() {
      let icon = this.#html("link[rel='shortcut icon'], link[rel='icon shortcut'], link[rel='icon']").attr('href') || '';

      if (!isAbolute(icon)) {
         icon = new URL(icon, this.#url).href;
      }

      return icon;
   }

   resolveProps(props = []) {
      let obj = {};
      if (props.length === 0) {
         return this.toObject();
      }

      props.forEach(prop => {
         let propName = '_' + prop + '_';

         if (typeof this[propName] === 'function') {
            obj[prop] = this[propName]();
         }
      });

      console.log("PROPS", obj)

      return obj;
   }

   toObject() {
      return {
         title: this._title_(),
         description: this._description_(),
         thumb: this._thumb_(),
         icon: this._icon_()
      }
   }
}
