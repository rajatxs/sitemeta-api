
/** Check whether server is running on local or production */
export function onProd() {
   return process.env.NODE_ENV === 'production';
}

/** Check whether given url is absolute or not */
export function isAbolute (val) {
   return (val.indexOf('://') > 0 || val.indexOf('//') === 0 )
}
