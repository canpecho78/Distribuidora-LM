import { addKeyword, EVENTS } from "@builderbot/bot";
import AttemptHandler from "../funciones/intentosFallidos.js";
import MongoDBClient from "../mongo/mongoDB.js";

const maxTries = 3;
const updatedOrderData = addKeyword(EVENTS.ORDER)

  .addAnswer(
    ["_Envie lo que deseas agregar a su pedido desde el catalogo_ ","*Menu:*\nhttps://wa.me/c/18293910869"],
    { capture: true },
    async (ctx, { state, fallBack, provider, endFlow }) => {


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
      await state.update({ algoMasExtra: formattedOrders });
      //Limpiar estado de intentos
      await attemptHandler.cleanTries()

    }

  )
  .addAnswer("Guardando cambios...", {delay: 2000},
    async (ctx, { state, endFlow }) => {
        const telefono = ctx.from; // Número de teléfono del usuario
        const stateData = await state.getMyState(); // Datos almacenados en el estado
        const { algoMasExtra } = stateData; // Obtener solo los campos necesarios

        // Actualizar los datos del pedido en la base de datos
        const updatedPedido = { algoMasExtra }; // Solo actualiza los campos permitidos
        const result = await MongoDBClient.updatePedido(telefono, updatedPedido);

        if (result.success) {
            const clienteActualizado = result.data; // Datos del cliente actualizados
            return endFlow(
                `*Su pedido ha sido actualizado exitosamente.* \n\n*Pedido:* ${clienteActualizado.pedido} \n\n*Extra:* ${clienteActualizado.algoMasExtra||'Sin extra'} \n\n*Nombre:* ${clienteActualizado.nombre} \n*Teléfono:* ${clienteActualizado.telefono}`
            );
        } else {
            return endFlow(
                "No se realizaron cambios en su pedido. Por favor, comuníquese con soporte desde el menú principal."
            );
        }
    }
);



export default updatedOrderData;