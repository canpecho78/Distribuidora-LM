// //@ts-check
// import { addKeyword } from "@builderbot/bot";

// //Flow
// import agregar from "./order5";
// const combo = addKeyword("Combo")
// .addAnswer('Lista de combos', { capture: false }, async (ctx, { provider }) => {
//   const list = {
//     "header": {
//       "type": "text",
//       "text": "Combos"
//     },
//     "body": {
//       "text": "¡Aprovechalo por tiempo limitado!"
//     },
//     "footer": {
//       "text": "Síguenos en Instagram para más ofertas"
//     },
//     "action": {
//       "button": "Ver más",
//       "sections": [
//         {
//           "title": "ECOPANADA",
//           "rows": [
//             {
//               "id": "001",
//               "title": "Combo $200",
//               "description": "Empanada de Jamón & Queso, Jugo de Limón, Salsa Extra"
//             },
//             {
//               "id": "002",
//               "title": "Combo $200",
//               "description": "Empanada de Pollo & Queso, Batida de Fresa, Quipe Extra"
//             }
//           ]
//         },
//         {
//           "title": "Sandwich",
//           "rows": [
//             {
//               "id": "003",
//               "title": "Combo $240",
//               "description": "Sandwich con papas y refresco"
//             },
//             {
//               "id": "004",
//               "title": "Combo $250",
//               "description": "Sandwich vegetariano con ensalada y agua"
//             }
//           ]
//         },
//         {
//           "title": "Bebidas",
//           "rows": [
//             {
//               "id": "006",
//               "title": "Refresco",
//               "description": "Refresco de 350ml"
//             },
//             {
//               "id": "007",
//               "title": "Jugo Natural",
//               "description": "Jugo de Naranja, Manzana o Fresa"
//             }
//           ]
//         }
//       ]
//     }
//   };

//   await provider.sendList(ctx.from, list);
// })
// .addAnswer('Selecciona', { capture: true,buttons:[{body:'Cancelar pedido'}] }, async (ctx, { endFlow, state, gotoFlow }) => {
//   const selectedItemId = ctx.body; 
//   const list = [
//     {
//       "title": "ECOPANADA",
//       "rows": [
//         {
//           "id": "001",
//           "title": "Combo $200",
//           "description": "Empanada de Jamón & Queso, Jugo de Limón, Salsa Extra"
//         },
//         {
//           "id": "002",
//           "title": "Combo $200",
//           "description": "Empanada de Pollo & Queso, Batida de Fresa, Quipe Extra"
//         }
//       ]
//     },
//     {
//       "title": "Sandwich",
//       "rows": [
//         {
//           "id": "003",
//           "title": "Combo $240",
//           "description": "Sandwich con papas y refresco"
//         },
//         {
//           "id": "004",
//           "title": "Combo $200",
//           "description": "Sandwich vegetariano con ensalada y agua"
//         }
//       ]
//     },
//     {
//       "title": "Bebidas",
//       "rows": [
//         {
//           "id": "006",
//           "title": "Refresco",
//           "description": "Refresco de 350ml"
//         },
//         {
//           "id": "007",
//           "title": "Jugo Natural",
//           "description": "Jugo de Naranja, Manzana o Fresa"
//         }
//       ]
//     }
//   ];
  
//   if (ctx.body === 'Cancelar pedido')
//   return endFlow('Pedido cancelado')
  
//   const selectedCombo = list.find(item => item.rows.some(row => row.id === selectedItemId));
//   const selectedRow = selectedCombo ? selectedCombo.rows.find(row => row.id === selectedItemId) : null;
  
//   const selectedRowDescription = selectedRow ? selectedRow.description : null;
//   await state.update({ combo: selectedRowDescription });
//   return gotoFlow(agregar);
// });