export class Cotizacion {
    constructor(public id: number, public empresaId: number, public fecha: string, public valor: number) {

    }

    public static clone(item: Cotizacion): Cotizacion {
        return new Cotizacion(item.id, item.empresaId, item.fecha, item.valor);
    }

    public static fromJson(datos): Cotizacion {
        // se comprueba que todos los campos necesarios para instanciar una Tarea estan
        if (!datos.id || !datos.empresaId || !datos.fecha || !datos.valor){
            // si falta alguno se lanza una exception
            throw(new Error('Invalid argument: argument structure do not match with model fields'));
        }
        return new Cotizacion(datos.id, datos.empresaId, datos.fecha, datos.valor);
    }
}
