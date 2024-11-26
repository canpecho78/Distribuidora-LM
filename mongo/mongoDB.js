import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno desde un archivo .env

class MongoDBClient {
    constructor() {
        const uri = process.env.MONGODB_URI;  // Utiliza variables de entorno para el URI de conexión

        if (!uri) {
            throw new Error("La URI de conexión a MongoDB no está definida. Asegúrate de definir la variable de entorno MONGODB_URI.");
        }

        this.client = new MongoClient(uri);
        this.database = null;
    }

    async connect() {
        if (!this.database) {
            await this.client.connect();
            this.database = this.client.db(process.env.DB_NAME);  // Utiliza variables de entorno para el nombre de la base de datos
        }
    }





    async ValidExistsData(
        codigo = '',
        numeroOrden = '',
        fecha = '',
        pedido = '',
        combo = '',
        algoMasExtra = '',
        nombre = '',
        telefono = '',
        direccionEnvio = '',
        referenciaOcomentario = '',
        efectivoTarjeta = '',
        estado = '',
        nuevoEstado = ''
    ) {
        await this.connect();
        const collection = this.database.collection(process.env.COLLECTION_PEDIDOS);
        const query = {};
    
        if (codigo) {
            query.codigo = codigo;
        }
        if (numeroOrden) {
            query.numeroOrden = numeroOrden;
        }
        if (fecha) {
            query.fecha = fecha;
        }
        if (pedido) {
            query.pedido = pedido;
        }
        if (combo) {
            query.combo = combo;
        }
        if (algoMasExtra) {
            query.algoMasExtra = algoMasExtra;
        }
        if (nombre) {
            query.nombre = nombre;
        }
        if (telefono) {
            query.telefono = telefono;
        }
        if (direccionEnvio) {
            query.direccionEnvio = direccionEnvio;
        }
        if (referenciaOcomentario) {
            query.referenciaOcomentario = referenciaOcomentario;
        }
        if (efectivoTarjeta) {
            query.efectivoTarjeta = efectivoTarjeta;
        }
        if (estado) {
            query.estado = estado;
        }
        if (nuevoEstado) {
            query.nuevoEstado = nuevoEstado;
        }
    
        const client = await collection.findOne(query);
        return client; // Devuelve el cliente si existe, null en caso contrario
    }
    


    async updatePedido(telefono, updatedPedido) {
        await this.connect();
        const collection = this.database.collection(process.env.COLLECTION_PEDIDOS);
    
        // Definir el query para encontrar el pedido por teléfono
        const query = { telefono };
    
        // Definir los datos que se van a actualizar
        const update = { $set: updatedPedido };
    
        try {
            // Ejecutar la actualización en la base de datos
            const result = await collection.updateOne(query, update);
    
            if (result.modifiedCount > 0) {
                // Si la actualización fue exitosa, recuperar el pedido actualizado
                const clienteActualizado = await collection.findOne(query);
    
                // Retornar un objeto con los datos actualizados
                return {
                    success: true,
                    data: clienteActualizado,
                    message: "Pedido actualizado exitosamente."
                };
            } else {
                return {
                    success: false,
                    data: null,
                    message: "No se encontró el cliente o no se realizaron cambios."
                };
            }
        } catch (error) {
            // Manejo de errores
            console.error("Error actualizando el pedido:", error);
            return {
                success: false,
                data: null,
                message: "Ocurrió un error al intentar actualizar el pedido."
            };
        }
    }
    


    async addPedido(pedidos) {
        await this.connect();
        const collection = this.database.collection(process.env.COLLECTION_PEDIDOS);  // Usa una variable de entorno para la colección de pedidos
        const result = await collection.insertOne(pedidos);
        return result.insertedId;
    }

   

    // async pedidos(iD = '', numeroOrden = '', f3cha = '', h0ra = '', p3dido = '', e3xtra = '', n4me = '', t5elefono = '', d5ireccion = '', r5eferencia = '', metodoPago = '') {
    //     await this.connect();
    //     const collection = this.database.collection(process.env.COLLECTION_PEDIDOS);
    //     const query = {};
    
    //     if (iD) {
    //         query.iD = iD;
    //     }
    //     if (numeroOrden) {
    //         query.numeroOrden = numeroOrden;
    //     }
    //     if (f3cha) {
    //         query.f3cha = f3cha;
    //     }
    //     if (h0ra) {
    //         query.h0ra = h0ra;
    //     }
    //     if (p3dido) {
    //         query.p3dido = p3dido;
    //     }
    //     if (e3xtra) {
    //         query.e3xtra = e3xtra;
    //     }
    //     if (n4me) {
    //         query.n4me = n4me;
    //     }
    //     if (t5elefono) {
    //         query.t5elefono = t5elefono;
    //     }
    //     if (d5ireccion) {
    //         query.d5ireccion = d5ireccion;
    //     }
    //     if (r5eferencia) {
    //         query.r5eferencia = r5eferencia;
    //     }
    //     if (metodoPago) {
    //         query.metodoPago = metodoPago;
    //     }
    
    //     const client = await collection.insertOne(query);
    //     return client;  // Devuelve el cliente si existe, null en caso contrario
    // }
    


    
    
    

   


  




    async close() {
        await this.client.close();
        this.database = null;
    }
}

export default new MongoDBClient();
