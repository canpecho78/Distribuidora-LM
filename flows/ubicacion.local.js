//@ts-check
import { addKeyword } from "@builderbot/bot";
//Funciones
import  {companyInfo}  from "../utils/index.js";

//FLow
import companyInfo2 from "../utils/manoguayabo.js"; 
import bienvenida from "./bienvenido.usuario.js";

const location = addKeyword("@!#@").addAnswer(
    ["Ubociaciones de nuestras DISTRIBUIDORAS." ],{},async (ctx, { provider}) => {

      
      const number = ctx.key.remoteJid
      await provider.vendor.sendMessage(number, companyInfo,companyInfo2);
    }
  )

  .addAction(async (ctx, { provider }) => {

      
      const number = ctx.key.remoteJid
      await provider.vendor.sendMessage(number,companyInfo2);


      
    }
  )
  .addAnswer(
    ["*1️⃣-Regresar al Menu*", "*2️⃣-Gracias eso es todo*" ],{ delay:6000,capture: true}
    , 
    async (ctx, {endFlow, gotoFlow }) => {
      if (ctx.body == "1") {
        return gotoFlow(bienvenida)
      }
       else if 
      (ctx.body == "2") {
        return endFlow("Excelente, tenga feliz resto del dia")}
    
  }
  );
  export default location;