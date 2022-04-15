export class Cotizacion {
    constructor(public empresaId: number, public fecha: string, public valor: number, public id: number = -1) {

    }

    public static clone(item: Cotizacion): Cotizacion {
        return new Cotizacion(item.empresaId, item.fecha, item.valor, item.id);
    }

    public static fromJson(datos): Cotizacion {
        // se comprueba que todos los campos necesarios para instanciar una Tarea estan
        if (!datos.id || !datos.empresaId || !datos.fecha || !datos.valor){
            // si falta alguno se lanza una exception
            throw(new Error('Invalid argument: argument structure do not match with model fields'));
        }
        return new Cotizacion(datos.id, datos.empresaId, datos.fecha, datos.valor);
    }

    public static convertir (datos: Cotizacion)  {
        let unaFecha = datos.fecha.slice(0, 10);
        let year = unaFecha.slice(0, 4);
        let month = unaFecha.slice(4, 7);
        let day = unaFecha.slice(8);
        let nuevaFecha = day +  month + '-' + year;
        datos.fecha = nuevaFecha;
    }
}
