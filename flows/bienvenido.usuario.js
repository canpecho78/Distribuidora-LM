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

//Esta es la funcion que se encarga de dar la bienvenida al usuario, se activa con cualquier mensaje
const bienvenida = addKeyword(EVENTS.WELCOME)

//Esta funcion se encarga de verificar si el horario es correcto para que el usuario pueda interactuar con el bot
//Si esta dentro del horario se le permite interactuar con el bot
  //   .addAction(async (ctx, { provider,endFlow }) => {

  //     if (verificarHorario(ctx, provider)) {
  //         return endFlow()
  //       }

  //     })
  //Esta es la primera respuesta del bot la cual le da la bienvenida al usuario
  .addAction({ delay: 2000 }, async (ctx, { flowDynamic }) => {
    await flowDynamic(
      `_Hola *${ctx.name}* Soy el asistente automatizado de *TU NEGOCIO*._`
    );
  })
  //Estas son varias opciones para el usuario con las que puede interactuar con el bot
  .addAnswer(["*_Seleccione una opcion_*", "\n1️⃣-Menu", "2️⃣-Soporte", "3️⃣-Ubicaciones", "\n\n*4️⃣-Mas opciones => cuentas bancarias y verificar el estado de su pedido*"], { capture: true },
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