//@ts-check
import { addKeyword } from "@builderbot/bot";
import recoger from "./opciones.entrega.js";

//Flow


const flowName = addKeyword(["@5es3"], { sensitive: true }).addAnswer(
    "¿Cual es su nombre?",
    { capture: true},
    async (ctx, { state, gotoFlow }) => {
    const nombre = (ctx.body)
      await state.update({ nombre: nombre  });
  
      return gotoFlow(recoger);
    }
  );

  export default flowName;