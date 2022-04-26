import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ServicioEmpresaService } from '../services/servicio-empresa.service';
import { HttpServicioService } from '../services/http-servicio.service';
import { ServicioGraficoService } from '../services/servicio-grafico.service';
import { DataGrafico } from '../models/data-grafico';
import { Cotizacion } from '../models/cotizacion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  toggle = "Detener scroll infinito";

  url: string;
  pagina = 1;
  empresas_por_pagina = 8;

  // public checkeds = 0;
  public limit = 3;

  public params = '?';
  public params2 = '';
  public nombreBusqueda = '';

  public nombreSeleccionada: string;
  public fechasSeleccionada: string[];
  public valoresSeleccionada: number[];
  // public grafico: DataGrafico;

  public ultima = false;

  constructor(public servicio: ServicioEmpresaService , public httpServicio: HttpServicioService, public alertController: AlertController, 
    public graficoServicio: ServicioGraficoService, public router: Router) {
    this.inicializarLista();
    this.getEmpresas(false, "");
  }

  // Metodo llamado por el scroll infinito cuando se activa
  loadData(event) {
    setTimeout(() => {
      this.getEmpresas(true, event);
    }, 1000);
  }

  // Metodo para activar o desactivar el scroll infinito
  toggleInfiniteScroll() {
    if(!this.ultima) {
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
    
    if(this.toggle == "Detener scroll infinito"){
      this.toggle = "Activar scroll infinito";
    } else {this.toggle = "Detener scroll infinito"}
  }

  // Metodo ejecutado al seleccionar las empresas que se utilizaran en los graficos
  public comprobar(seleccionado) {
    if (!seleccionado.isChecked){
      this.graficoServicio.checkeds++;
      console.log(this.graficoServicio.checkeds);
      this.nombreSeleccionada = seleccionado.nombre;
      this.graficoServicio.pagina = 2;
      this.graficoServicio.paginarDatos = true;
      this.obtenerCotizaciones(seleccionado.id, seleccionado.nombre);
    } else {
      let index = 4;
      this.graficoServicio.checkeds--;
      console.log(this.graficoServicio.checkeds);
      this.graficoServicio.pagina = 2;
      this.graficoServicio.paginarDatos = true;
      for(let i = 0; i < this.graficoServicio.DataGraficos.length; i++) {
        this.graficoServicio.DataGraficos[i].data.splice(0, this.graficoServicio.DataGraficos[i].data.length - 10);
        this.graficoServicio.DataGraficos[i].fechas.splice(0, this.graficoServicio.DataGraficos[i].fechas.length - 10);
        if(this.graficoServicio.DataGraficos[i].id == seleccionado.id) {
          index = i;
        }
      }
      this.graficoServicio.DataGraficos.splice(index, 1);
    }
  }

  // Metodo para recargar empresas en el scroll infinito
  public getEmpresas(otraCarga, event) {
    this.url = this.params + this.nombreBusqueda + this.params2 + 'page=' + this.pagina + '&_limit=' + this.empresas_por_pagina;
    this.httpServicio.getEmpresasList(this.url)
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.servicio.empresas.push(data[i]);
          for(let j = 0; j < this.graficoServicio.DataGraficos.length; j++) {
            if(data[i].id == this.graficoServicio.DataGraficos[j].id) {
              data[i].isChecked = true;
            }
          }
        }
        if(data.length < 10) {
          this.ultima = true;
        }
        console.log(this.servicio.empresas);
        if (otraCarga)
          event.target.complete();
          this.pagina++;
      }, error => {
        console.log(error);
      });
  }
  
  // Metodo para inicializar la lista, las empresas seleccionadas para el grafico y resetear el scroll infinito
  public inicializarLista() {
    this.servicio.empresas = [];
    this.pagina = 1;
    this.ultima = false;
    // this.graficoServicio.DataGraficos = [];
    // this.checkeds = 0;
  }

  // Metodo utilizado por el buscador para encotrar resultados en el servidor
  public searching(event) {
    console.log('Buscando...');
    console.log(event.detail.value);
    this.inicializarLista();
    this.nombreBusqueda = event.detail.value;
    if(event.detail.value === '') {
      this.params = '?';
      this.params2 = '';
    } else {
      this.params = '?nombre_like=';
      this.params2 = '&';
    }
    this.url = this.params + this.nombreBusqueda + this.params2 + '_page=' + this.pagina + '&_limit=' + this.empresas_por_pagina;
    this.getEmpresas(false, "");
  }

  // Metodo para obtener las cotizaciones de la empresa seleccionada para graficos
  public obtenerCotizaciones(id, nombre) {
    this.httpServicio.getListaCotizacionesEmpresa(id, '').subscribe((data: Cotizacion[]) => {
      for (let i = 0; i < data.length; i++) {
        Cotizacion.convertir(data[i]);
        this.fechasSeleccionada.push(data[i].fecha);
        this.valoresSeleccionada.push(data[i].valor);
      }
      this.fechasSeleccionada.reverse();
      this.valoresSeleccionada.reverse();
      console.log(this.fechasSeleccionada);
      console.log(this.valoresSeleccionada);
      this.graficoServicio.grafico = new DataGrafico(nombre, this.valoresSeleccionada, this.fechasSeleccionada, id);
      this.graficoServicio.DataGraficos.push(this.graficoServicio.grafico);
      console.log(this.graficoServicio.DataGraficos);
      this.fechasSeleccionada = [];
      this.valoresSeleccionada = [];
    }, error => {
      console.log(error);
    });
  }

  // Metodo para comprobar la compatibilidad de los datos de fechas y valores de las 3 empresas seleccionadas para las gráficas
  public consolidar() {
    let permitir = true;
    let rango = this.graficoServicio.DataGraficos[0].fechas.length;
    for(let i = 0; i < this.graficoServicio.DataGraficos.length; i++) {
      if(this.graficoServicio.DataGraficos[i].fechas.length != rango) {
        permitir = false;
        this.alertaDatosIncompatibles();
        break;
      }
      for(let j = 0; j < this.graficoServicio.DataGraficos[i].fechas.length; j++) {
        if(this.graficoServicio.DataGraficos[i].fechas[j] != this.graficoServicio.grafico.fechas[j]) {
          permitir = false;
          break;
        }
        if(!permitir) {
          this.alertaDatosIncompatibles();
          break;
        }
      }
    }
    if(permitir) {
      this.router.navigateByUrl('/graficos');
      this.graficoServicio.generaGrafico();
    }
  }

  // Metodo para manejar la eliminacion de una empresa a través de una ventana de alerta para evitar eliminaciones indeseadas
  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar!',
      message: '¿Esta seguro que quiere eliminar la <strong>empresa</strong>?!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Operacion cancelada');
          }
        }, {
          text: 'Eliminar',
          cssClass: 'eliminar',
          id: 'confirm-button',
          handler: () => {
            this.httpServicio.deleteEmpresa(id).subscribe((data) => {
              console.log(data);
              // Recargamos la pantalla con datos actualizados desde el servidor
              this.inicializarLista();
              this.getEmpresas(false, "");
            },
            (error) => {
              console.log(error);
            });
            console.log('Confirmar Eliminar Empresa');
            console.log(id);
          }
        }
      ]
    });
    await alert.present();
  }

  // Metodo que presenta la ventana de alerta impidiendo la generacion de graficos con datos incompatibles
  async alertaDatosIncompatibles() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Seleccion incompatible',
      message: 'Imposible crear gráfico por datos incompatibles.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Operacion cancelada');
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
    this.inicializarLista();
    this.fechasSeleccionada = [];
    this.valoresSeleccionada = [];
  }
}
