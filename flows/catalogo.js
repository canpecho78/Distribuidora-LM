// @ts-nocheck
import { addKeyword } from "@builderbot/bot";
// Funciones
import AttemptHandler from "../funciones/intentosFallidos.js";
import  MongoDBClient  from "../mongo/mongoDB.js";
// Flow
import updateOrder from "./opciones.pedido.js";
import { EVENTS } from "@builderbot/bot";
import cancelar from "./cancelar.order.js";

const maxTries = 3;

const catalogo = addKeyword(EVENTS.ORDER)
  .addAction({delay: 2000},async (ctx, {provider,gotoFlow}) => {
    const input = ctx.from.trim();
    const orderExists = await MongoDBClient.ValidExistsData("","","","","","","",input);
    const client = orderExists;

    if (client) {
      const { pedido, algoMasExtra, nombre, telefono, direccionEnvio, referenciaOcomentario, efectivoTarjeta, estado } = client;
      const mensaje = `*Ya tienes una orden con los siguientes detalles:* \n\n*Pedido:* ${pedido} \n*Extra:* ${algoMasExtra || "Sin extra"} \n*Nombre:* ${nombre} \n*Tel:* ${telefono} \n*Direccion:* ${direccionEnvio} \n*Referencia:* ${referenciaOcomentario} \n*Efectivo o tarjeta:* ${efectivoTarjeta} \n*Estado:* ${estado || "Pendiente"}`;
        await provider.sendText(ctx.key.remoteJid, mensaje);
        return gotoFlow(cancelar);
    }else{
      return 
    }
    
    
  })
  //const continuar = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["_Arma tu carrito y envíalo_","\n*Menu:*\nhttps://wa.me/c/18293910869"],
    {delay: 2000,capture: true },
    async (ctx, { state, gotoFlow, endFlow, fallBack, provider }) => {

      // Inicializar AttemptHandler para gestionar intentos
      const attemptHandler = new AttemptHandler(state, maxTries);
      const maxAttemptsReached = await attemptHandler.excedTries();
      
      if (maxAttemptsReached) {
        await attemptHandler.cleanTries();
        return endFlow("Has superado el número de intentos *“Proceso cancelado”*");
      }

      const orderMessage = ctx.message?.orderMessage;

      if (!orderMessage) {
        await attemptHandler.updateTries();
        return fallBack("Por favor realice esta acción a través del catálogo/menu↗️");
      }

      const orderId = orderMessage.orderId;
      const token = orderMessage.token;

      // Obtener los detalles del pedido usando el proveedor
      const orderDetails = await provider.getOrderDetails(orderId, token);

      // Verificar si los productos tienen las propiedades requeridas
      if (
        !orderDetails.products || 
        !orderDetails.products.some((product) =>
          ["id", "name", "quantity"].every((prop) => Object.keys(product).includes(prop))
        )
      ) {
        await attemptHandler.updateTries();
        return fallBack("Por favor realice esta acción a través del catálogo/menu↗️");
      }

      // Si los productos tienen las propiedades correctas, procesar el pedido
      const products = orderDetails.products.map((product) => {
        return {
          id: product.id,
          name: product.name,
          quantity: product.quantity
        };
      });

      // Formatear los productos para su presentación
      const formattedProducts = products.map((product) => 
        `Producto: ${product.name}\nCantidad: ${product.quantity}`
      ).join("\n");

      console.log("=== LISTA DE PRODUCTOS PROCESADA ===");
      console.log(formattedProducts);

      await state.update({ pedido: formattedProducts });
      await attemptHandler.cleanTries();

      return gotoFlow(updateOrder);
    }
  );





export default catalogo;
