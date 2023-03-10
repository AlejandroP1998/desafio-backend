import crypto from 'crypto'

//const salts = crypto.randomBytes(128).toString('base64')-> con este codigo generamos conjuntos de caracteres aleatorios unicos para la generacion de nuestros datos encryptados
const salt = '6EggWKTUH5pLAixfkcg2Fpg1IP837QBVjiag4IAV2wdz+C7v+SRYfTHUOk/gBQr/oj6ioNTE5xtvqgpqejE4It5MdwnllSTwYY5JmbfAApxPZFh/iOKTvEPkl1wAKi5vyfa80W7mJtycEOwCSjzn3wTSHJtC+C6dq9yyolNfSk8='

export function encrypt(nonEncrypt){
  const enc = crypto.createHmac('sha256',salt).update(nonEncrypt).digest('hex')
  return enc
}

console.log('encrypt: ', encrypt('h'));
console.log('encrypt: ', encrypt('h'));
console.log('encrypt: ', encrypt('h'));