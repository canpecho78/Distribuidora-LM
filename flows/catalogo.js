//@ts-check
import { addKeyword } from "@builderbot/bot";
// Funciones
import AttemptHandler from "../funciones/intentosFallidos.js";
// Flow
import updateOrder from "./opciones.pedido.js";
import { EVENTS } from "@builderbot/bot";

const maxTries = 3;

const catalogo = addKeyword(EVENTS.ORDER)
  .addAction(async (_, { flowDynamic }) => {
    await flowDynamic('*Menu:*\nhttps://wa.me/c/18293910869');
  })
  .addAnswer(
    "_Arma tu carrito y envíalo_",
    { capture: true },
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
