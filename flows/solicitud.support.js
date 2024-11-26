//@ts-check
import { addKeyword } from "@builderbot/bot"

const agentFlow = addKeyword("agente")
    .addAction({ delay: 4000 },
        async (ctx, { state, provider, endFlow }) => {
            const detalles = state.getMyState().detailsData;
            const agentPhone = process.env.AGENT_PHONE;
            await provider.sendText(`${agentPhone}@c.us`, `El cliente *${ctx.name}* ${ctx.from} está solicitando asistencia de un personal con los siguientes detalles: \n\n*${ctx.name}:* ${detalles}`);
            return endFlow("Gracias por los detalles.\n\nEn unos minutos un agente se estará contactando con usted")
        })
export default agentFlow;