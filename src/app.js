//import { join } from 'path'
//ts-check

import {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    //EVENTS,
  } from "@builderbot/bot";
  import { MemoryDB as Database } from "@builderbot/bot";
  import { BaileysProvider as Provider } from '@builderbot/provider-baileys'


  
  
  //Flow
  import bienvenida from "../flows/bienvenido.usuario.js";
  import flowName from "../flows/flowName.js";
  import updatePedido from "../flows/actualizar.pedido.js";
  import updateOrder from "../flows/opciones.pedido.js";
  import pago from "../flows/pago.js";
  import agregar from "../flows/pedido.extra.js";
  import location from "../flows/ubicacion.local.js"; 
  import catalogo from "../flows/catalogo.js";
  import recoger from "../flows/opciones.entrega.js";
  import Direccion from "../flows/direccion.Envio.js";
  import agentFlow from "../flows/solicitud.support.js";
import cuentasBancarias from "../flows/cuentasBancarias.js";
import localmanoguayabo from "../flows/local.manoguayabo.js";
import cancelar from "../flows/cancelar.order.js";
import updatedOrderData from "../flows/updated.order.js";
import verificarEstado from "../flows/verificar.estado.js";
import masOpciones from "../flows/masOpciones.js";
import detalles from "../flows/supportData.js";
  
  
  const PORT = process.env.PORT ?? 3008;
  

  
  //const maxTries = 2;

  
  const respeto = addKeyword([
    "coño",
    "diablo",
    "malditasea",
    "maldita sea",
  ]).addAnswer("Por favor mantenga el respeto", async (ctx, { endFlow }) => {
    return endFlow();
  });
  
  const bien = addKeyword("esta bien").addAnswer(
    "De acuerdo",
    async (ctx, { endFlow }) => {
      return endFlow();
    }
  );
  
  const ok = addKeyword("ok").addAnswer("👍🏻", async (ctx, { endFlow }) => {
    return endFlow();
  });
  
  const gracias = addKeyword("gracias").addAnswer(
    "A ti por preferirnos",
    async (ctx, { endFlow }) => {
      return endFlow();
    }
  );



const main = async () => {
    const adapterFlow = createFlow([
        bienvenida,
        agregar,
        flowName,
        gracias,
        agentFlow,
        ok,
        bien,
        respeto,
        location,
        updateOrder,
        updatePedido,
        pago,
        recoger,
        Direccion,
        catalogo,
        cuentasBancarias,
        localmanoguayabo,
        cancelar,
        updatedOrderData,
        verificarEstado,
        masOpciones,
        detalles
    ])

  
    
    
    const adapterProvider = createProvider(Provider)

    adapterProvider.on("message", async (ctx) => {
        adapterProvider.vendor.readMessages([ctx.key]);
      });

    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })




    adapterProvider.server.post(
      '/api/estado',
      handleCtx(async (bot, req, res) => {
        try {
          const { telefono, nuevoEstado } = req.body;
      
          if (!telefono || !nuevoEstado) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Faltan datos requeridos' }));
          }
      
          // Construir el mensaje basado en el nuevo estado
          const message = `Su pedido se esta *${nuevoEstado}*`;
          const message2 = `Su pedido esta *${nuevoEstado}*`;
          const message3 = `Su pedido se encuentra *${nuevoEstado}*`;
          const message4 = `Su pedido a sido  *${nuevoEstado}*`;
          const message5 = `Su pedido a sido *${nuevoEstado}*`;
          
          // Crear un objeto de opciones vacío (puedes agregar más opciones si es necesario)
          const options = {}; // Aquí puedes agregar botones o medios si lo necesitas en el futuro
    
          // Enviar el mensaje por WhatsApp
          if (nuevoEstado === 'Procesando') {
            await bot.sendMessage(telefono, message, options);
          } else if (nuevoEstado === 'Listo para enviar') {
            await bot.sendMessage(telefono, message2, options);
          } else if (nuevoEstado === 'Pendiente') {
            await bot.sendMessage(telefono, message3, options);
          } else if (nuevoEstado === 'Enviado') {
            await bot.sendMessage(telefono, message4, options);
          } else if (nuevoEstado === 'Cancelado') {
            await bot.sendMessage(telefono, message5, options);
          }
          
      
          // Responder al cliente
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Mensaje enviado con éxito' }));
        } catch (error) {
          console.error('Error al procesar el pedido:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Error interno del servidor' }));
        }
      })
    );
    
    
    

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
          
        try {
          const { number, intent } = req.body
          const formatNumber = `${number}@s.whatsapp.net`
          if (intent === 'add') {
            await adapterProvider.sendText(formatNumber,'Un agente ha sido asignado a esta conversación')
            bot.blacklist.add(number)
          }
          if (intent === 'remove') {
            await adapterProvider.sendText(formatNumber, 'El agente ha culminado la conversación')
            bot.blacklist.remove(number)
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ status: 'ok', number, intent }))
        } catch (error) {
          console.error("ERROR at blacklist", error)
        }
        })
    )
  

    httpServer(+PORT);








   
  };

main();
