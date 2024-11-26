import { addKeyword,EVENTS } from "@builderbot/bot";
import agentFlow from "./solicitud.support.js";

const detalles = addKeyword(EVENTS.ACTION)
.addAnswer("Porfavor denos detalles de su inconveniente o duda", {delay: 2000, capture: true },
async (ctx, { state, gotoFlow }) => {

    const detailsData = (ctx.body)
    await state.update({ detailsData: detailsData  });
    return gotoFlow(agentFlow);
})

export default detalles;