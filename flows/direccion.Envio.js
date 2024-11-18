//@ts-check
import { addKeyword,EVENTS } from "@builderbot/bot";

//Funciones
import AttemptHandler from "../funciones/intentosFallidos.js";
import { companyInfo, maxDistanceDelivery } from "../utils/index.js";
import haversineDistance from "../funciones/geolocalizacion.js";
import isValidDistance from "../funciones/isValidDistance.js";
import generateLocationURL from "../funciones/linkGeo.js";
//Flow
import pago from "./pago.js";


const maxTries = 3;
const Direccion = addKeyword(EVENTS.ACTION).addAnswer(
    ["Envie su 📍Ubicacion. Por favor que NO sea escrita"],
    { capture: true},
    async (ctx, { state, fallBack, endFlow, gotoFlow }) => {
      //FuncionClas
      const attemptHandler = new AttemptHandler(state, maxTries);
      const maxAttemptsReached = await attemptHandler.excedTries();
  
      // Verificar si el usuario ha alcanzado el máximo de intentos
      if (maxAttemptsReached) {
        //Limpiar numero de intentos
        await attemptHandler.cleanTries()
        return endFlow(
          "Has superado el numero de intentos *“Proceso cancelado”*"
        ); 
      }
      //console.log(ctx);
      if (ctx?.message?.locationMessage?.degreesLatitude && ctx?.message?.locationMessage?.degreesLongitude) {
        const userGeo = {
          degreesLatitude: ctx.message.locationMessage.degreesLatitude,
          degreesLongitude: ctx.message.locationMessage.degreesLongitude,
        };
        
        console.log("Localización desde WhatsApp:", userGeo);
        
        const userDistance = haversineDistance(
          Number(companyInfo.location.degreesLatitude),
          Number(companyInfo.location.degreesLongitude),
          Number(userGeo.degreesLatitude),
          Number(userGeo.degreesLongitude)
        );
        
        const isValid = isValidDistance(userDistance, maxDistanceDelivery);
        
        if (!isValid) {
          await attemptHandler.cleanTries();
          return endFlow(
            `Su distancia está fuera del rango permitido para el servicio a domicilio. Rango máximo *10 kilómetros*. \nSu pedido ha sido cancelado ❌`
          );
        }
      
        const direccionEnvio = generateLocationURL(userGeo);
        await state.update({ distance: userDistance, direccionEnvio });
        await attemptHandler.cleanTries();
        return gotoFlow(pago);
      }
      
      
      if (ctx?.body.toLowerCase().trim() == "salir") {
        await attemptHandler.cleanTries()
        return endFlow("❌ Su pedido ha sido cancelado ❌");
      }
      await attemptHandler.updateTries()
      return fallBack(
        'Por favor envié su ubicación actual \nO en caso contrario escriba *"Salir"* para cancelar'
      );
    }
  );

  export default Direccion;