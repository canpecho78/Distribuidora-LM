import { addKeyword,EVENTS } from "@builderbot/bot";
import agentFlow from "./solicitud.support.js";
import updatedOrderData from "./updated.order.js";

const cancelar = addKeyword(EVENTS.ACTION).addAnswer(
    ["Opcion-1️⃣","*Si deseas cancelar su pedido contacte con soporte*","\nOpcion-2️⃣","*Si deseas agregarle algo mas a su pedido*", "\n*Opcion-3️⃣ Gracias, eso es todo*"],
    { delay: 2000, capture: true },
    async (ctx, { gotoFlow,endFlow }) => {
        
        if (ctx.body === "1") {
            return gotoFlow(agentFlow);
        }
        else if (ctx.body === "2"){
        return gotoFlow(updatedOrderData);
        } else if (ctx.body === "3") {
            return endFlow("Excelente, tenga feliz resto del dia");
        }
  }
)


export default cancelar;