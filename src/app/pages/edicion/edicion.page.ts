import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Empresa } from 'src/app/models/empresa';
import { HttpServicioService } from '../../services/http-servicio.service';
import { ServicioEmpresaService } from 'src/app/services/servicio-empresa.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.page.html',
  styleUrls: ['./edicion.page.scss'],
})
export class EdicionPage implements OnInit {

  public id: number;
  public titulo: string;
  public textoBoton: string;

  public formulario;

  public empresa: Empresa;
  public empresaEditada: Empresa;
  public nombreEmpresa: string;

  constructor(public activatedRouter: ActivatedRoute, public formBuilder: FormBuilder, public servicioHttp: HttpServicioService, public servicio: ServicioEmpresaService,
     public alertController: AlertController, public router: Router) { 
    this.formulario = formBuilder.group({
      nombre: ["", Validators.compose([Validators.minLength(1), Validators.min(0), Validators.max(100), Validators.required])],
      direccion: ["", Validators.compose([Validators.minLength(1), Validators.min(0), Validators.max(100), Validators.required])],
      web: ["", Validators.compose([Validators.minLength(1), Validators.min(0), Validators.max(100), Validators.required])],
      sector: ["", Validators.compose([Validators.minLength(1), Validators.min(0), Validators.max(100), Validators.required])],
      logo: ["", Validators.compose([Validators.minLength(1), Validators.min(0), Validators.max(100), Validators.required])],
      destacada: true
    });
  }

  // Metodo ejecutado por el boton del formulario, bien para crear o bien para edtitar una empresa
  // public enviar(value) {
  //   console.log(value);
  //   console.log(this.nombreEmpresa);
  //   console.log(value.nombre);
  //   // Se comprueba si la pagina es para creacion o para edicion de empresa
  //   // Si es para creacion, se comprueba que no exista una empresa con el mismo nombre antes de crearla
  //   if(this.nombreEmpresa !== value.nombre) {
  //     this.servicioHttp.comprobarNombreEmpresas(value.nombre).subscribe((data: any) => {
  //       console.log(data);
  //       if(data.length > 0) {
  //         this.mensajeAlerta();
  //         console.log("Ya existe esa empresa");
  //       } else if(this.id == -1){
  //         this.empresa = new Empresa(value.nombre, value.logo, value.sector, value.direccion, value.web, value.destacada);
  //         this.crearEmpresa();
  //       } else {
  //         this.empresaEditada = new Empresa(value.nombre, value.logo, value.sector, value.direccion, value.web, value.destacada);
  //         this.modificarEmpresa(this.id, this.empresaEditada);
  //       }
  //     }, error => {
  //       console.log(error);
  //     });
  //   } else {
  //     this.empresaEditada = new Empresa(value.nombre, value.logo, value.sector, value.direccion, value.web, value.destacada);
  //     this.modificarEmpresa(this.id, this.empresaEditada);
  //   }
  // }

  // Metodo ejecutado por el boton del formulario, bien para crear o bien para edtitar una empresa
  public enviar(value) {
    console.log(value);
    // console.log(this.nombreEmpresa);
    console.log(value.nombre);
    // Se comprueba si la pagina es para creacion o para edicion de empresa
    // Si es para creacion, se comprueba que no exista una empresa con el mismo nombre antes de crearla
    if(this.id == -1) {
        this.empresa = new Empresa(value.nombre, value.logo, value.sector, value.direccion, value.web, value.destacada);
        this.crearEmpresa();
    } else {
      this.empresaEditada = new Empresa(value.nombre, value.logo, value.sector, value.direccion, value.web, value.destacada);
      this.modificarEmpresa(this.id, this.empresaEditada);
    }
  }

  // Metodo ejecutado para crear una empresa nueva
  public crearEmpresa() {
    this.servicioHttp.createEmpresa(this.empresa).subscribe((data: any) => {
      console.log(data);
      this.limpiar();
      this.router.navigateByUrl('/');
    }, error => {
      console.log(error);
    });
  }

  // Metodo ejecutado para editar una empresa
  public modificarEmpresa(id: number, empresa: Empresa) {
    this.servicioHttp.updateEmpresa(id, empresa).subscribe((data: any) => {
      console.log('Cuanto tarda...');
      console.log(data);
      this.router.navigateByUrl('/');
    }, error => {
      console.log(error);
    });
  }

  // Metodo para borrar los valores del formulario
  public limpiar() {
    this.formulario.setValue({nombre: "", direccion: "", web: "", sector: "", logo: "", destacada: true});
  }

  // Metodo para recuperar los valores iniciales del formulario
  public resetear() {
    console.log("hola que hay");
    if(typeof this.empresaEditada === 'undefined') {
      this.formulario.setValue({nombre: "", direccion: "", web: "", sector: "", logo: "", destacada: true});      
    } else {
      this.formulario.setValue({nombre: this.empresaEditada.nombre, direccion: this.empresaEditada.direccion, web: this.empresaEditada.url, sector: this.empresaEditada.sector, logo: this.empresaEditada.logo, destacada: this.empresaEditada.destacada});
    }    
  }

  // Metodo para presentar un mensaje de alerta informando de que no ha sido posible crear la empresa debido a coincidencia del nombre con una existente
  async mensajeAlerta() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Operación cancelada',
      message: 'No se puede crear la empresa. Ya existe una con ese nombre.',
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
    this.id = +this.activatedRouter.snapshot.paramMap.get('id');
    console.log(this.id);
    this.nombreEmpresa = "";
    if(this.id == -1) {
      this.titulo = "Crear empresa";
      this.textoBoton = "Crear empresa";
    } else {
      this.titulo = "Editar empresa";
      this.textoBoton = "Modificar datos";
      this.servicioHttp.getEmpresa(this.id).subscribe((data: Empresa) =>{
        console.log(data);
        this.empresaEditada = Empresa.clone(data);
        this.nombreEmpresa = this.empresaEditada.nombre;
        this.servicio.nombreEmpresaEditada = data.nombre;
        console.log(this.empresaEditada);
        this.formulario.setValue({nombre: this.empresaEditada.nombre, direccion: this.empresaEditada.direccion, web: this.empresaEditada.url, sector: this.empresaEditada.sector, logo: this.empresaEditada.logo, destacada: this.empresaEditada.destacada});
    }, error => {
      console.log(error);
      });
    }
  }
}
