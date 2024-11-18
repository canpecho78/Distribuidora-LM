//@ts-check
import { addKeyword } from "@builderbot/bot";
//Funciones
import { companyInfo, distribuidoraDos } from "../utils/index.js";

//FLow
import catalogo from "./catalogo.js";

const location = addKeyword("@!#@").addAnswer(
    ["0️⃣-Regresar al Menu" ],{ capture: false}
    , 
    async (ctx, { provider, gotoFlow }) => {

      
      const number = ctx.key.remoteJid
      await provider.vendor.sendMessage(number, companyInfo,distribuidoraDos);


      if (ctx.body == "0") {
        return gotoFlow(catalogo)}
    }
  );

  export default location;