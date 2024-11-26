import { addKeyword,EVENTS } from "@builderbot/bot";
import verificarEstado from "./verificar.estado.js";
import cuentasBancarias from "./cuentasBancarias.js";

const masOpciones = addKeyword(EVENTS.ACTION)
  .addAnswer(["1️⃣-Verificar estado de mi pedido", "2️⃣-Cuentas bancarias"], {delay: 2000, capture: true },
    async (ctx, { gotoFlow, fallBack }) => {

      const Opciones = ctx.body

      if (Opciones === '1') {
        return gotoFlow(verificarEstado)
      }
      if (Opciones === '2') {
        return gotoFlow(cuentasBancarias)
      } else
        return fallBack("_*Seleccione una opcion valida!*_")
    }
  )

export default masOpciones;