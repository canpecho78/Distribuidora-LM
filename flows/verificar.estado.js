// @ts-check
import { addKeyword,EVENTS } from "@builderbot/bot";
import MongoDBClient from "../mongo/mongoDB.js";

const verificarEstado = addKeyword(EVENTS.ACTION)
  .addAction({delay: 2000},async (ctx, { provider, endFlow }) => {
    try {
      // Extraer el input del usuario
      const input = ctx.from?.trim();

      if (!input) {
        // Manejar el caso en que no se proporcione un input válido
        return endFlow("No se proporcionó información válida para verificar el estado del pedido.");
      }

      // Buscar el pedido en la base de datos por el teléfono
      const orderExists = await MongoDBClient.ValidExistsData(
        "", "", "", "", "", "","", input
      );

      if (orderExists) {
        // Extraer el estado del pedido
        const { estado } = orderExists;
        const mensaje = `*Estado de su pedido:* ${estado || "Pendiente"}`;
        
        // Enviar mensaje al usuario
        await provider.sendText(ctx.key.remoteJid, mensaje);
        return endFlow();
      } else {
        return endFlow("No se encontró un pedido asociado con este número. Por favor, revise su información o dirijase al menu principal para realizar un nuevo pedido.");
      }
    } catch (error) {
      console.error("Error al verificar el estado del pedido:", error);
      return endFlow("Ocurrió un error al intentar verificar el estado del pedido. Inténtelo nuevamente más tarde o comuníquese con soporte en el menu principal.");
    }
  });

export default verificarEstado;
