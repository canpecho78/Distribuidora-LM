// import dotenv from 'dotenv';
// dotenv.config();

// import { JWT } from "google-auth-library";
// import { GoogleSpreadsheet } from "google-spreadsheet";

// const SCOPES = [
//   "https://www.googleapis.com/auth/spreadsheets",
//   "https://www.googleapis.com/auth/drive.file",
// ];

// class GoogleSheetService {
//   jwtFromEnv = undefined;
//   doc = undefined;

//   constructor(id = undefined) {
//     if (!id) {
//       throw new Error("ID_UNDEFINED");
//     }

//     this.jwtFromEnv = new JWT({
//       email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//       key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//       scopes: SCOPES,
//     });
//     this.doc = new GoogleSpreadsheet(id, this.jwtFromEnv);
//   }

//   async sendWhatsAppMessage(number, message) { 
//     console.log(number, message);
//     try {
//         const response = await fetch('https://rq04wdcv-3008.use2.devtunnels.ms/v1/messages', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ number, message }),
//         });

//         if (!response.ok) {
//             throw new Error('Error al enviar el mensaje: ' + response.statusText);
//         }

//         console.log(`Mensaje enviado a ${number}: ${message}`);
//     } catch (error) {
//         console.error('Error al enviar el mensaje:', error);
//     }
//   }

//   async checkAndNotifyOrderStatus(provider) {
//     try {
//       console.log("Cargando información de la hoja de Google Sheets...");
  
//       await this.doc.loadInfo(); // Carga la hoja
//       const sheet = this.doc.sheetsByIndex[1]; // Suponiendo que las órdenes están en la segunda hoja
//       const rows = await sheet.getRows(); // Cargar todas las filas
  
//       console.log(`Número de filas encontradas: ${rows.length}`);
  
//       for (const row of rows) {
//         // Verifica si la columna 12 tiene una letra
//         if (row.col12 && /^[A-Za-z]$/.test(row.col12)) { // Solo letras
//           console.log(`Fila con actualización en columna 12: ${row.col12}`);
  
//           const customerNumber = row.col8; // Número del cliente en la columna 8
//           const message = `Su orden ha sido despachada.`;
          
//           if (customerNumber) {
//             console.log(`Enviando mensaje a ${customerNumber}: ${message}`);
  
//             // Envía el mensaje utilizando el bot
//             await provider.sendText(`${customerNumber}@c.us`, message)
//     .then(() => console.log(`Mensaje enviado a ${customerNumber}`))
//     .catch((err) => console.error("Error al enviar mensaje a WhatsApp:", err));

//           } else {
//             console.log("No se encontró un número de cliente en la columna 8.");
//           }
//         } else {
//           console.log("No hay cambios en la columna 12 para esta fila.");
//         }
//       }
//     } catch (error) {
//       console.error("Error al verificar o enviar mensajes:", error);
//     }
//   }

  

//   async saveOrder(data = {}) {
//     await this.doc.loadInfo();
//     const sheet = this.doc.sheetsByIndex[0]; // the first sheet

//     const order = await sheet.addRow({
//       numeroOrden: data.numeroOrden,
//       fecha: data.fecha,
//       hora: data.hora,
//       pedido: data.pedido,
//       combo: data.combo,
//       algoMasExtra: data.algoMasExtra,
//       nombre: data.nombre,
//       telefono: data.telefono,
//       direccionEnvio: data.direccionEnvio,
//       referenciaOcomentario: data.referenciaOcomentario,
//       efectivoTarjeta: data.efectivoTarjeta,
//       locationUbi: data.locationUbi
//     });

//     return order;
//   }

//   async clearOrdersData() {
//     try {
//       await this.doc.loadInfo();
//       const sheet = this.doc.sheetsByIndex[1]; // Assuming orders data is on the second sheet

//       // Obtiene todas las filas actuales en la hoja de pedidos
//       const rows = await sheet.getRows();

//       // Elimina cada fila en la hoja de pedidos
//       for (const row of rows) {
//         await row.delete();
//       }

//       console.log("Datos de pedidos eliminados correctamente.");
//     } catch (error) {
//       console.error("Error al eliminar los datos de pedidos:", error);
//     }
//   }
// }

// export default GoogleSheetService;
