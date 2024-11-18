//@ts-check
import { addKeyword,EVENTS } from "@builderbot/bot";
//Funciones
import AttemptHandler from "../funciones/intentosFallidos.js";
//Flow
import flowName from "./flowName.js";

const maxTries = 3;
const updatePedido = addKeyword(EVENTS.ACTION)

.addAction(async (_, { flowDynamic }) => {
  await flowDynamic('*Menu:*\nhttps://wa.me/c/18293910869');
})

.addAnswer(
    "_Envie su nuevo pedido desde el catalogo_ ",
    { capture: true},
    async (ctx, { state, gotoFlow,fallBack,provider, endFlow }) => {
      

      //FuncionClass
      const attemptHandler = new AttemptHandler(state, maxTries);
      const maxAttemptsReached = await attemptHandler.excedTries()
      // Verificar si el usuario ha alcanzado el máximo de intentos
      if (maxAttemptsReached) {
        //Limpiar estado despues de superar el numero de intentos
        await attemptHandler.cleanTries()
        return endFlow(
          "Has superado el numero de intentos *“Proceso cancelado”*"
        ); 
      }
      //Condicion debe de enviar los productos validos
      const orderMessage = ctx.message?.orderMessage; 
      
     if (!orderMessage) { 
       
        //Actualizar el numero de intentos fallidos del usuario 
        await attemptHandler.updateTries()
        return fallBack("Por favor realice esta accion a travez del catalogo/menu↗️");
      }
      //Mapeo y formato de parametros del catalogo
      const iderId = orderMessage.orderId;
      const token = orderMessage.token;
      const orderDetails = await provider.getOrderDetails(iderId, token);
  
      if (!orderDetails) {
        //Actualizar el numero de intentos fallidos del usuario 
        await attemptHandler.updateTries()
        return fallBack("Por favor realice esta accion a travez del catalogo/menu↗️");
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
      const formattedOrders = products.map((product) => 
        `Producto: ${product.name}\nCantidad: ${product.quantity}`
      ).join("\n");
  
      console.log(formattedOrders);
      //Guardar en el estado la orden del usuario
      await state.update({ pedido: formattedOrders });
       //Limpiar estado de intentos
      await attemptHandler.cleanTries()
      return gotoFlow(flowName);
    }
  );

  export default updatePedido;