import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpServicioService } from '../../services/http-servicio.service';
import { Cotizacion } from 'src/app/models/cotizacion';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-valor',
  templateUrl: './valor.page.html',
  styleUrls: ['./valor.page.scss'],
})
export class ValorPage implements OnInit {

  public idEmpresa: number;
  public idCotizacion: number;
  public titulo: string;
  public textoBoton: string;

  public formulario;

  public cotizacion: Cotizacion;
  public cotizacionEditada: Cotizacion;
  public fechaCotizacion: string;

  constructor(public activatedRouter: ActivatedRoute, public formBuilder: FormBuilder, public servicioHttp: HttpServicioService, public alertController: AlertController, public router: Router) {
    this.formulario = formBuilder.group({
      fecha: ["", Validators.compose([Validators.minLength(1), Validators.min(0), Validators.max(100), Validators.pattern('^[0-3][0-9][-][0-1][0-9][-][1-2][0-9]{3}$'), Validators.required])],
      valor: [, Validators.compose([Validators.minLength(1), Validators.min(0), Validators.max(10000000), Validators.pattern('\\d*\\.?\\d{1,2}'), Validators.required])]
    });
  }

  // Metodo ejecutado por el boton del formulario, bien para crear o bien para editar una cotizacion
  public enviar(value) {
    console.log(value);
    console.log(this.fechaCotizacion);
    console.log(value.fecha);
    // Se comprueba si la pagina es para creacion o para edicion de empresa
    if(this.fechaCotizacion !== value.fecha) {
      this.servicioHttp.comprobarFechaCotizacion(this.idEmpresa, value.fecha).subscribe((data: any) => {
        console.log(data);
        // Se comprueba que no se produzcan duplicados de fechas de cotizacion para una empresa
        if(data.length > 0) {
          this.mensajeAlerta();
          console.log("Ya existe esa fecha");
        } else if(this.idCotizacion == -1){
          this.cotizacion = new Cotizacion(this.idEmpresa, value.fecha, value.valor);
          this.crearCotizacion();
        } else {
          this.cotizacionEditada = new Cotizacion(this.idEmpresa, value.fecha, value.valor);
          this.modificarCotizacion(this.idCotizacion, this.cotizacionEditada);
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.cotizacionEditada = new Cotizacion(this.idEmpresa, value.fecha, value.valor);
      this.modificarCotizacion(this.idCotizacion, this.cotizacionEditada);
    }
  }

  // Metodo para crear una cotizacion
  public crearCotizacion() {
    this.servicioHttp.createCotizacion(this.cotizacion).subscribe((data: any) => {
      console.log(data);
      this.limpiar();
      this.router.navigateByUrl('/cotizaciones/' + this.idEmpresa);
    }, error => {
      console.log(error);
    });
  }

  // Metodo para modificar una cotizacion
  public modificarCotizacion(id: number, cotizacion: Cotizacion) {
    this.servicioHttp.updateCotizacion(id, cotizacion).subscribe((data: any) => {
      console.log(data);
      this.router.navigateByUrl('/cotizaciones/' + this.idEmpresa);
    }, error => {
      console.log(error);
    });
  }

  public limpiar() {
    this.formulario.setValue({fecha: "", valor: null});
  }

  // Metodo para resetear los datos
  public resetear() {
    if(typeof this.cotizacionEditada === 'undefined') {
      this.limpiar();
    } else {
      this.formulario.setValue({fecha: this.cotizacionEditada.fecha, valor: this.cotizacionEditada.valor});
    }
  }
  // Metodo para presentar un mensaje de alerta informando de que no ha sido posible crear la empresa debido a coincidencia del nombre con una existente
  async mensajeAlerta() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Operación cancelada',
        message: 'No se puede crear la cotización. Ya existe una con esa fecha.',
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
    this.idEmpresa = +this.activatedRouter.snapshot.paramMap.get('id');
    console.log(this.idEmpresa);
    this.idCotizacion = +this.activatedRouter.snapshot.paramMap.get('id2');
    console.log(this.idCotizacion);
    this.fechaCotizacion = "fecha";
    
    if(this.idCotizacion == -1) {
      this.titulo = "Crear cotizacion";
      this.textoBoton = "Crear cotizacion";
    } else {
      this.titulo = "Editar cotizacion";
      this.textoBoton = "Modificar cotizacion";
      this.servicioHttp.getCotizacion(this.idCotizacion).subscribe((data: Cotizacion) =>{
        console.log(data);
        this.cotizacionEditada = Cotizacion.clone(data);
        this.fechaCotizacion = this.cotizacionEditada.fecha;
        console.log(this.cotizacionEditada);
        this.formulario.setValue({fecha: this.cotizacionEditada.fecha, valor: this.cotizacionEditada.valor});
    }, error => {
      console.log(error);
      });
    }
  }
}
