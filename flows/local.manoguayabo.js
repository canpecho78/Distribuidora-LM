//@ts-check
import { addKeyword } from "@builderbot/bot";
//Funciones


//FLow
import catalogo from "./catalogo.js";
import companyInfo2 from "../utils/manoguayabo.js"; 

const localmanoguayabo = addKeyword("@!@#@").addAnswer(
    ["0️⃣-Regresar al Menu" ],{ capture: false}
    , 
    async (ctx, { provider, gotoFlow }) => {

      
      const number = ctx.key.remoteJid
      await provider.vendor.sendMessage(number,companyInfo2);


      if (ctx.body == "0") {
        return gotoFlow(catalogo)}
    }
  );

  export default localmanoguayabo;