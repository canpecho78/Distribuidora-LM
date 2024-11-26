//@ts-check
import { addKeyword,EVENTS } from "@builderbot/bot";
//Funciones
import AttemptHandler from "../funciones/intentosFallidos.js";


import moment from 'moment-timezone'
//Services
//import GoogleSheetService from "../services/sheets/index.js";


//Flujos



//const GOOGLE_SHEET_ID = "1pc9J1akNIPvcIhXJ8oicKYw7kk7JPWG2LCO3vR3okdM"; // ID de tu hoja de cálculo
//const googleSheet = new GoogleSheetService(GOOGLE_SHEET_ID);

const maxTries = 3;
const pago = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "\nCómo desea realizar el pago?",
    "\n1️⃣-Efectivo","2️⃣-Transferencia", "\nCUENTAS BANCARIAS","\nBHD: 22014710011","\nBANRECERVAS: 9600783785","\nPOPULAR: 835355330","\nSANTA CRUZ: 11311000005771"],
    {
      delay: 2000,capture: true
    },
    async (ctx, { state, endFlow,fallBack }) => {
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
    
    
    // Verificar la selección del usuario
    if (ctx.body === "1"){
      const ef = (ctx.body="Efectivo");
      await state.update({ efectivoTarjeta: ef });
      await attemptHandler.cleanTries()
    }
    else if ( ctx.body === "2") {
      const tf = (ctx.body="Transferencia");
      await state.update({ efectivoTarjeta: tf });
      await attemptHandler.cleanTries()
      }
        // Si selecciona 'Efectivo' o 'Tarjeta', continuar con el flujo
       else {
        //Actualizar estado si el usuario fallo
        await attemptHandler.updateTries()
        // Si no selecciona ninguna opción válida, retornar fallBack
        return fallBack("*Seleccione una opcion valida!*");
      }
    }
  )
  .addAnswer([
    "\nReferencias para la entrega / Comentario / Factura fiscal / Cualquier sugerencia escribalo ¡Aqui!","\n_O si deseas retroceder o cancelar su pedido seleccione una de estas *opciones*_",
     "\n1️⃣-Retroceder","\n2️⃣-Cancelar pedido"],
    {
      delay: 2000,capture: true,
    },
    async (ctx, { state, endFlow, gotoFlow }) => {
        
      await state.update({ referenciaOcomentario: ctx.body });
      
      if (ctx.body == "1") return gotoFlow(pago);
      else if (ctx.body === "2")
        return endFlow("Pedido cancelado");
    }
  )
  .addAnswer(
    [
      "¡Perfecto! hemos recibido su orden.",
      "Nuestro mensajero le comunicará cuando esté de camino."
    ],{delay: 2000},
    
    async (ctx, { state, flowDynamic }) => {
      
      const currentState = state.getMyState();
      
      const p3dido = currentState.pedido || 'Sin pedido';  // Default en caso de que falte
      const e3xtra = currentState.algoMasExtra || 'Sin extra';
      const n4me = currentState.nombre || 'Sin nombre';
      const t5elefono = ctx.from || 'Sin teléfono';
      const d5ireccion = currentState.direccionEnvio || 'Sin dirección';
     

  
      console.log(`Pedido: *${p3dido}*, Algo más extra: *${e3xtra}*, Nombre: *${n4me}*, Teléfono: *${t5elefono}*`);
      
      // Obtener la fecha y hora actual
      const horaCompleta = moment().tz("Etc/GMT+4");
      const hora = horaCompleta.format("HH");
      const minutos = horaCompleta.format("mm");
     
  
      console.log(`Hora actual en GMT-4: ${hora}:${minutos}`);
  
      // Función para generar un número de orden
      function generarNumeroOrden() {
        return `EPM-${Math.floor(Math.random() * 100000)}`;
      }
  
      const numeroOrden = generarNumeroOrden();
      const fecha = new Date();
      //const dia = fecha.getDate().toString().padStart(2, "0");
      //const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      //const año = fecha.getFullYear();
      //const fechaNumerica = `${dia}-${mes}-${año}`;
    
      const codigo = 2;
    
    
    
      // Guardar la orden en Google Sheets
      // try {
      //   await googleSheet.saveOrder({
      //     numeroOrden: numeroOrden,
      //     fecha: fechaNumerica,
      //     hora: `${hora}:${minutos}`,
      //     pedido: currentState.pedido,
      //     combo: currentState.combo,
      //     algoMasExtra: currentState.algoMasExtra,
      //     nombre: currentState.nombre,
      //     telefono: ctx.from,
      //     direccionEnvio: currentState.direccionEnvio,
      //     referenciaOcomentario: currentState.referenciaOcomentario,
      //     efectivoTarjeta: currentState.efectivoTarjeta,
      //   });
  
      //   console.log("Orden guardada en Google Sheets");
  
      // } catch (error) {
      //   console.error("Error guardando la orden en Google Sheets:", error);
      // }
  




     // Enviar la orden al backend con fetch
      try {
        await fetch(process.env.CRM_PEDIDOS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            codigo,
            numeroOrden,
            fecha: fecha,
            hora: `${hora}:${minutos}`,
            pedido: currentState.pedido,
            combo: currentState.combo,
            algoMasExtra: currentState.algoMasExtra,
            nombre: currentState.nombre,
            telefono: ctx.from,
            direccionEnvio: currentState.direccionEnvio,
            referenciaOcomentario: currentState.referenciaOcomentario,
            efectivoTarjeta: currentState.efectivoTarjeta,
          }),
        });
        
        console.log("Orden enviada al backend");
  
      } catch (error) {
        console.error("Error enviando la orden al backend:", error);
      }
    
  
  
    await flowDynamic([`*Pedido:* ${p3dido}\n\n*Algo más extra:* ${e3xtra}\n\n*Nombre:* ${n4me}\n*Numero de orden:* ${numeroOrden}\n*Teléfono:* ${t5elefono} \n*Direccion:* ${d5ireccion}`]);
    
    
    /*const tiempoEsperaMinutos1 = 10;
    const tiempoEsperaMilisegundos1 = tiempoEsperaMinutos1 * 60 * 1000;
    
    const tiempoEsperaMinutos2 = 15;
    const tiempoEsperaMilisegundos2 = tiempoEsperaMinutos2 * 60 * 1000;
    
    setTimeout(async () => {
      await provider.sendText(`${ctx.from}@c.us`, "¡Hola! Tu pedido está listo para ser enviado." );
      
      }, tiempoEsperaMilisegundos1);
      
      setTimeout(async () => {
        await provider.sendText(`${ctx.from}@c.us`, "¡Tu! Pedido está en camino, mantente pendiente, es posible que el mensajero te haga una llamada." );
        }, tiempoEsperaMilisegundos2);*/
        
        // function calcularTiempoHastaHoraEspecifica(
        //   hora,
        //   minutos = 0,
        //   segundos = 0,
        //   milisegundos = 0
        // ) {
        //   const ahora = moment().tz("Etc/GMT+4");
        //   const destino = moment().tz("Etc/GMT+4");
          
        //   destino.set({
        //     hour: hora,
        //     minute: minutos,
        //     second: segundos,
        //     millisecond: milisegundos,
        //   });
          
        //   if (ahora > destino) {
        //     destino.add(1, "day");
        //   }
          
        //   return destino.diff(ahora);
        // }
        
        // function iniciarProcesoDeEliminacion() {
        //   console.log(
        //     "Iniciando el proceso de eliminación: " +
        //     moment().tz("Etc/GMT+4").format()
        //   );
          
        //   const eliminarDatoCada = 10000;
        //   const totalDeDatosAEliminar = 40;
        //   let contadorDeDatosEliminados = 0;
          
        //   const intervalId = setInterval(async () => {
        //     if (contadorDeDatosEliminados >= totalDeDatosAEliminar) {
        //       clearInterval(intervalId);
        //       console.log("Proceso de eliminación completado.");
        //     } else {
        //       await googleSheet.clearOrdersData();
        //       contadorDeDatosEliminados++;
        //       console.log(
        //         `Dato eliminado. Total eliminados: ${contadorDeDatosEliminados}`
        //       );
        //     }
        //   }, eliminarDatoCada);
        // }
        
        // const tiempoHastaLaHoraEspecifica = calcularTiempoHastaHoraEspecifica(1);
        
        // setTimeout(() => {
        //   iniciarProcesoDeEliminacion();
        //   console.log(
        //     `Tiempo hasta la ejecución: ${tiempoHastaLaHoraEspecifica}ms`
        //   );
          
        //   // Y luego repetir cada 24 horas
        //   setInterval(iniciarProcesoDeEliminacion, 24 * 60 * 60 * 1000);
        // }, tiempoHastaLaHoraEspecifica);
      }
    );
    
    export default pago;