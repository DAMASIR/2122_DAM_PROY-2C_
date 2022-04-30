export class DataGrafico {
    constructor(public label: string, public data: any[], public fechas: any[], public id: number) {

    }

    public static clone(item: DataGrafico): DataGrafico {
        return new DataGrafico(item.label, item.data, item.fechas, item.id);
    }

    public static fromJson(datos): DataGrafico {
        // se comprueba que todos los campos necesarios para instanciar una Tarea estan
        if (!datos.label || !datos.data || !datos.fechas || !datos.id){
            // si falta alguno se lanza una exception
            throw(new Error('Invalid argument: argument structure do not match with model fields'));
        }
        return new DataGrafico(datos.label, datos.data, datos.fechas, datos.id);
    }
}
