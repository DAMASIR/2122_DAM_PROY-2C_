import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Empresa } from '../models/empresa';
import { AlertController } from '@ionic/angular';
import { HttpServicioService } from './http-servicio.service';
import { Cotizacion } from '../models/cotizacion';

@Injectable({
  providedIn: 'root'
})
export class ServicioEmpresaService {

  public empresas: Empresa[];
  public cotizacionesEmpresa: Cotizacion[];

  constructor(public alertController: AlertController, private servicioHttp: HttpServicioService) { 
    this.empresas = [];
    this.cotizacionesEmpresa = [];
  }
}
