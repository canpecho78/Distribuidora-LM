import { addKeyword } from "@builderbot/bot";

const cuentasBancarias = addKeyword(EVENTS.ACTION).addAnswer(
    ["\nCUENTAS BANCARIAS","BHD: 22014710011","BANRECERVAS: 9600783785","POPULAR: 835355330","SANTA CRUZ: 11311000005771"],
    { capture: false },async (_, {  endFlow }) => {
        
        return endFlow();
        
    }
)

export default cuentasBancarias