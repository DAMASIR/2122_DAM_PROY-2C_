export class Empresa {
    constructor(public nombre: string, public logo: string, public sector: string, public direccion: string, 
        public url: string, public destacada: boolean, public id: number = -1) {

    }

    public static clone(item: Empresa): Empresa {
        return new Empresa(item.nombre, item.logo, item.sector, item.direccion, item.url, item.destacada, item.id);
    }

    public static fromJson(datos): Empresa {
        // se comprueba que todos los campos necesarios para instanciar una Tarea estan
        if (!datos.nombre || !datos.logo || !datos.sector || !datos.direccion || !datos.url || !(datos.destacada == true || datos.destacada == false)
            || !datos.id){
            // si falta alguno se lanza una exception
            throw(new Error('Invalid argument: argument structure do not match with model fields'));
        }
        return new Empresa(datos.nombre, datos.logo, datos.sector, datos.direccion, datos.url, datos.destacada, datos.id);
    }
}
