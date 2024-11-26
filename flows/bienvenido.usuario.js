//@ts-check
//BotLibraries
import { addKeyword, EVENTS } from "@builderbot/bot";

//Funciones
//import verificarHorario from "../funciones/funciones.js";

//Flows
import catalogo from "./catalogo.js";
import location from "./ubicacion.local.js";

import masOpciones from "./masOpciones.js";
import detalles from "./supportData.js";


const bienvenida = addKeyword(EVENTS.WELCOME)
  //   .addAction(async (ctx, { provider,endFlow }) => {

  //     if (verificarHorario(ctx, provider)) {
  //         return endFlow()
  //       }

  //     })
  .addAction({ delay: 2000 }, async (ctx, { flowDynamic }) => {
    await flowDynamic(
      `_Hola *${ctx.name}* Soy el asistente automatizado de *DISTRIBUIDORA MAÑON*._`
    );
  })
  .addAnswer(["*_Seleccione una opcion_*", "\n1️⃣-Menu", "2️⃣-Soporte", "3️⃣-Ubicaciones", "\n\n4️⃣-Mas opciones => cuentas bancarias y verificar el estado de mi pedido"], { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {

      const Opciones = ctx.body

      if (Opciones === '1') {
        return gotoFlow(catalogo)
      }
      if (Opciones === '2') {
        return gotoFlow(detalles)
      }
      if (Opciones === '3') {
        return gotoFlow(location)
      }
      if (Opciones === '4') {
        return gotoFlow(masOpciones)
      } else
        return fallBack("_*Seleccione una opcion valida!*_")
    }

  );

  

export default bienvenida;