import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.page.html',
  styleUrls: ['./edicion.page.scss'],
})
export class EdicionPage implements OnInit {

  public id;
  public titulo: string;
  public textoBoton: string;

  constructor(public activatedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    console.log(this.id);
    if(this.id == -1) {
      this.titulo = "Crear empresa";
      this.textoBoton = "Crear empresa";
    } else {
      this.titulo = "Editar empresa";
      this.textoBoton = "Modificar datos";
    }
  }

}
