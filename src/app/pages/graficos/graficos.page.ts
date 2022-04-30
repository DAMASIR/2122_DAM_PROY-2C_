import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ServicioGraficoService } from '../../services/servicio-grafico.service';
import { HttpServicioService } from 'src/app/services/http-servicio.service';
import { BaseChartDirective } from 'ng2-charts';
import { Cotizacion } from 'src/app/models/cotizacion';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  constructor(public servicio: ServicioGraficoService, public httpServicio: HttpServicioService, public alertController: AlertController) { }

  @ViewChild("baseChart") public chart: BaseChartDirective;

  public cambio = false;
  public tituloCambiar;
  public tituloDatos;
  public fechasRecarga = [];

  // Metodo ejecutado para cambiar el tipo de grafico
  public cambiar() {
    if(!this.cambio) {
      this.servicio.lineChartType = 'radar';
      this.tituloCambiar = 'Linea';
      this.cambio = true;
    } else {
      this.servicio.lineChartType = 'line';
      this.tituloCambiar = 'Radar';
      this.cambio = false;
    }
  }

  // Metodo ejecutado para recargar datos de cotizaciones paginados
  public recargar(indice: number) {
    let permitir = true;
    let params = '?page=' + this.servicio.pagina;
    this.httpServicio.getListaCotizacionesEmpresa(this.servicio.DataGraficos[indice].id, params).subscribe((data: Cotizacion[]) => {
      // Si el rango de las cotizaciones recargadas es menor que 10, no habra mas datos que recargar
      if(data.length < 10) {
        this.servicio.paginarDatos = false;
        this.tituloDatos = 'No hay mas datos';
      }
      for (let i = 0; i < data.length; i++) {
        Cotizacion.convertir(data[i]);
        this.servicio.fechasSeleccionada.push(data[i].fecha);
        this.servicio.valoresSeleccionada.push(data[i].valor);
      }
      this.servicio.fechasSeleccionada.reverse();
      this.servicio.valoresSeleccionada.reverse();

      this.fechasRecarga.push(this.servicio.fechasSeleccionada);

      this.servicio.DataGraficos[indice].fechas = this.servicio.fechasSeleccionada.concat(this.servicio.DataGraficos[indice].fechas);
      this.servicio.DataGraficos[indice].data = this.servicio.valoresSeleccionada.concat(this.servicio.DataGraficos[indice].data);
      this.servicio.fechasSeleccionada = [];
      this.servicio.valoresSeleccionada = [];

      // Se comprueba que los rangos de fechas recargadas son iguales
      // Si no son iguales se lanza una ventana de alerta impidiendo la recarga
      if(this.fechasRecarga[0].length == this.fechasRecarga[indice].length) {
        // Si los rangos son iguales se comprueba que las fechas son identicas
        // Si las fechas de los rangos no son identicas se lanza una ventana de alerta impidiendo la recarga
        for(let i = 0; i < this.fechasRecarga[0].length; i++) {
          if(this.fechasRecarga[0][i] != this.fechasRecarga[indice][i]) {
            this.fechasRecarga = [];
            permitir = false;
            this.servicio.paginarDatos = false;
            this.tituloDatos = 'No hay mas datos';
            this.alertaDatosIncompatibles();
            return;
          }
        }
        // Si todo es correcto se permite la recarga de las cotizaciones de otra empresa hasta llegar al total de 3 empresas
        // Si todo es correcto y ya se han cargado las cotizaciones de las 3 empresas se recarga el grafico comparativo con mas datos
        if(permitir && indice < 2) {
          indice++;
          this.recargar(indice);
        } else if(permitir && indice == 2) {
          this.fechasRecarga = [];
          this.servicio.pagina++;
          this.servicio.generaGrafico();
          this.chart.update();
        }
      } else {
        this.fechasRecarga = [];
        permitir = false;
        this.servicio.paginarDatos = false;
        this.tituloDatos = 'No hay mas datos';
        this.alertaDatosIncompatibles();
      }
    }, error => {
      console.log(error);
    });
  }  

  public chartClicked(e:any):void {
    console.log(e);
  }
  
  public chartHovered(e:any):void {
    console.log(e);
  }

  // Metodo que presenta la ventana de alerta impidiendo la recarga de graficos con datos incompatibles
  async alertaDatosIncompatibles() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Recarga de datos incompatibles',
      message: 'Imposible recargar datos por su incompatibilidad.',
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
    this.servicio.lineChartType = 'line';
    this.tituloCambiar = 'Radar';
    if(this.servicio.paginarDatos) {
      this.tituloDatos = 'Mas datos';
    } else {
      this.tituloDatos = 'No hay mas datos';
    }
  }

}
