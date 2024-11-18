//@ts-check
import { addKeyword,EVENTS } from "@builderbot/bot";

//Flow
import flowName from "./flowName.js";
import agregar from "./pedido.extra.js";



//Funciones
import AttemptHandler from "../funciones/intentosFallidos.js";
import updatePedido from "./actualizar.pedido.js";


//numero maximo de intentos fallidos del contador 
const maxTries = 3; 

const updateOrder = addKeyword(EVENTS.ACTION).addAnswer(
    [
      '\n_Si has terminado con su pedido_ ⬇️ *Opcion-1️⃣*',
      '\n_Si deseas cambiar o actualizar su pedido_ *Opcion-2️⃣*',
      '\n_Si quieres agregarle algo más a su pedido_ *Opcion-3️⃣*',
    ],
    {
      capture: true,
    },
    async (ctx, { gotoFlow, state, endFlow,fallBack }) => {
      //FuncionClass
      const attemptHandler = new AttemptHandler(state, maxTries);
      const maxAttemptsReached = await attemptHandler.excedTries()

      // Verificar si el usuario ha alcanzado el máximo de intentos
      if (maxAttemptsReached) {
        //Limpiar estado despues de superar el numero de intentos
        await attemptHandler.cleanTries()
        return endFlow(
          "Has superado el numero de intentos *“Proceso cancelado”*"
        ); 
      }
      if (ctx.body === "1") {
        await attemptHandler.cleanTries()
        return gotoFlow(flowName);
      } 
      else if (ctx.body === "2") {
        await attemptHandler.cleanTries()
        return gotoFlow(updatePedido);
      } 
      else if (ctx.body === "3") {
        await attemptHandler.cleanTries()
        return gotoFlow(agregar);
      } 
      
      else {
        await attemptHandler.updateTries();
        // Si no selecciona ninguna opción válida, volver al flujo 'actualizar'
        return fallBack("_Seleccione una opcion valida!_");
      }
  
    }
  );

  export default updateOrder;