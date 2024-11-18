//@ts-check
import { addKeyword,EVENTS } from "@builderbot/bot";
//Funciones
import AttemptHandler from "../funciones/intentosFallidos.js";
//Flow
import pago from "./pago.js";
import Direccion from "./direccion.Envio.js";


const maxTries = 3;
const recoger = addKeyword(EVENTS.ACTION).addAnswer([
    "\n_Pasara a retirar su pedido o se lo enviamos?_","\n1️⃣-Retirar","2️⃣-Delivery"],
    {
      capture: true
      },
    
    async (ctx, { state, gotoFlow, endFlow,fallBack }) => {
      //FuncionClas
      const attemptHandler = new AttemptHandler(state, maxTries);
      const maxAttemptsReached = await attemptHandler.excedTries()
      // Verificar si el usuario ha alcanzado el máximo de intentos
      if (maxAttemptsReached) {
        await attemptHandler.cleanTries()
        return endFlow(
          "Has superado el numero de intentos *“Proceso cancelado”*"
        ); 
      }
      if (ctx.body === "1") {
        const iraAretirar = (ctx.body = "Pasara por el pedido")
        
        await attemptHandler.cleanTries()
        await state.update({ direccionEnvio: iraAretirar });
        await attemptHandler.cleanTries()
        return gotoFlow(pago);
      } else if (ctx.body === "2") {
        await attemptHandler.cleanTries()
        return gotoFlow(Direccion);
      } else {
        // Si no selecciona 'Retirar' ni 'No', regresar al flujo 'Recoger'
       await attemptHandler.updateTries()
        return fallBack("Por favor seleccione una opcion valida");
      }
    }
  );

  export default recoger;