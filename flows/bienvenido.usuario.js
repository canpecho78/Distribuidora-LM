//@ts-check
//BotLibraries
import { addKeyword,EVENTS } from "@builderbot/bot";

//Funciones
//import verificarHorario from "../funciones/funciones.js";

//Flows
import catalogo from "./catalogo.js";
import location from "./ubicacion.local.js";
import agentFlow from "./solicitud.support.js";
import cuentasBancarias from "./cuentasBancarias.js";

const bienvenida = addKeyword(EVENTS.WELCOME)
//   .addAction(async (ctx, { provider,endFlow }) => {
    
//     if (verificarHorario(ctx, provider)) {
//         return endFlow()
//       }
      
//     })
    .addAction(async (ctx, { flowDynamic }) => {
      await flowDynamic(
        `_Hola *${ctx.name}* bienvenido a *DISTRIBUIDORA MAÑON* Automatizado._`
      );
    })
    .addAnswer(["_Selecciona una opcion_","1️⃣-Menu","2️⃣-Soporte","3️⃣-Ubicacion","4️⃣-Cuentas bancarias"],{capture:true},
        async(ctx,{gotoFlow,fallBack}) => {

      

    if (ctx.body == "1"){
      return gotoFlow(catalogo)
    }
    else if (ctx.body == "2"){
      return gotoFlow(agentFlow)
    }
    else if (ctx.body == "3"){
      return gotoFlow(location)
    }else
    if (ctx.body == "4"){
      return gotoFlow(cuentasBancarias)
    }else
      return fallBack("_*Seleccione una opcion valida!*_")
    }
    
  );

  export default bienvenida;