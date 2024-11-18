//@ts-check
import { addKeyword } from "@builderbot/bot"

const agentFlow = addKeyword("agente")
.addAction(
    async (ctx,{provider,endFlow}) => {
    const agentPhone = "18298380581"
    await provider.sendText(`${agentPhone}@c.us`,`El cliente *${ctx.name}* ${ctx.from} está solicitando un personal`)
    return endFlow("En unos minutos un agente se estará contactando con usted")
    })
export default agentFlow;