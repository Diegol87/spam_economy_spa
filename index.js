const enviar = require('./mailer')
const http = require('http')
const axios = require('axios')
const fs = require('fs')
const url = require('url')
const { v4: uuidv4 } = require('uuid')

http
    .createServer((req, res) => {
        let { correos, asunto, contenido } = url.parse(req.url, true).query

        if(req.url === '/') {
            res.setHeader('content-type', 'text/html')
            fs.readFile('index.html', 'utf8', (err, html) => {
                res.end(html)
            })
        }

        if(req.url.startsWith('/mailing')) {

            let dolar;
            let euro;
            let uf;
            let utm;

            async function getDatos() {
                let { data } = await axios.get('https://mindicador.cl/api') 
            
                dolar = data.dolar.valor;
                euro = data.euro.valor;
                uf = data.uf.valor;
                utm = data.utm.valor;
            }

            getDatos()
                .then(() => {
                    contenido += `\nEL valor del dolar es: ${dolar}
                    \nEl valor del euro es: ${euro}
                    \nEl valor de la uf es: ${uf}
                    \nEl valor de la utm es: ${utm}`

                    return correos,asunto,contenido
                })
                .then(() => {

                    if((correos !== '') && (asunto !== '') && (contenido !== '') && (correos.includes(','))) {
                        enviar(correos.split(','), asunto, contenido)

                        res.write('El correo fue enviado con exito')
                        res.end()

                        let id = uuidv4()

                        fs.writeFile(`correos/correo_id_${id}`, `Correos: ${correos}\nAsunto: ${asunto}\nContenido:\n${contenido}`, 'utf8', () => {
                            console.log(`Archivo para el correo_id_${id} creado con exito`)
                        })
                    } else {
                        res.write('No estan todos los campos completos')
                        res.end()
                    }
                })
        }
        
    })
    .listen(3000, () => {
        console.log('Server ON')
    })