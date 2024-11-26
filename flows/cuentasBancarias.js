import { addKeyword,EVENTS } from "@builderbot/bot";

const cuentasBancarias = addKeyword(EVENTS.ACTION).addAnswer(
    ["\nCUENTAS BANCARIAS","\nBHD: 22014710011","\nBANRECERVAS: 9600783785","\nPOPULAR: 835355330","\nSANTA CRUZ: 11311000005771"],
    { delay: 2000 },async (_, {  endFlow }) => {
        
        return endFlow();
        
    }
)

export default cuentasBancarias;