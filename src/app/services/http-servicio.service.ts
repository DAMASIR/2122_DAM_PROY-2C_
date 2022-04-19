import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Empresa } from '../models/empresa';
import { Cotizacion } from '../models/cotizacion';

@Injectable({
  providedIn: 'root'
})
export class HttpServicioService {

  public basePath1 = 'http://localhost:3000/empresas';
  public basePath2 = 'http://localhost:3000/cotizaciones';

  public basePath3 = 'http://192.168.3.103/api/empresas';
  public basePath4 = 'http://192.168.3.103/api/cotizacions';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // Manejar errores de API
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('An error occurred:', error.error.message);
    } else {
        // El servidor devuelve un mensaje no exitoso.
        // El cuerpo de la respuesta puede dar pistas del motivo del error.
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ${error.error}`
        );
    }
    // Devuelve un observable con un mensaje de error.
    return throwError('Something bad happened; please try again later.');
  }

  // Metodo para crear una empresa
  createEmpresa(item): Observable<Empresa> {
    // Se modifican los nombres de los campos a enviar para que sean compatibles con los del servidor
    let datos = `{"nombre": "${item.nombre}", "logo": "${item.logo}", "sector": "${item.sector}",
    "direccion": "${item.direccion}", "url": "${item.url}", "destacada": ${item.destacada}}`;

    return this.http
    .post<Empresa>(this.basePath3, datos, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para crear una cotizacion
  createCotizacion(item): Observable<Cotizacion> {
    // Se modifican los nombres de los campos a enviar para que sean compatibles con los del servidor
    let datos = `{"empresa": "/api/empresas/${item.empresaId}", "fecha": "${item.fecha}", "valor": ${item.valor}}`;

    return this.http
    .post<Cotizacion>(this.basePath4, datos, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para obtener una empresa
  getEmpresa(id): Observable<Empresa> {
    return this.http
    .get<Empresa>(this.basePath3 + '/' + id)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para obtener una cotizacion
  getCotizacion(id): Observable<Cotizacion> {
    let id_num = Number(id);
    return this.http
    .get<Cotizacion>(this.basePath4 + '/' + id_num)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para comprobar el nombre de las empresas y evitar duplicidades de nombres
  comprobarNombreEmpresas(params): Observable<Empresa[]> {
    return this.http
    .get<Empresa[]>(this.basePath1 + '?nombre='+ params)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para comprobar las fechas de las cotizaciones y evitar duplicidades de fechas
  comprobarFechaCotizacion(id, params): Observable<Cotizacion[]> {
    return this.http
    .get<Cotizacion[]>(this.basePath1 + '/' + id + '/cotizaciones' + '?fecha='+ params)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para obtener el listado de empresas
  getEmpresasList(params): Observable<Empresa[]> {
    return this.http
    .get<Empresa[]>(this.basePath3 + params)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para obtener le listado de cotizaciones de una empresa
  getListaCotizacionesEmpresa(id, params): Observable<Cotizacion[]> {
    let id_num = Number(id);
    return this.http
    .get<Cotizacion[]>(this.basePath3 + '/' + id_num + '/cotizaciones' + params)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para actualizar una empresa
  updateEmpresa(id, item): Observable<Empresa> {
    let datos = `{"nombre": "${item.nombre}", "logo": "${item.logo}", "sector": "${item.sector}",
    "direccion": "${item.direccion}", "url": "${item.url}", "destacada": ${item.destacada}}`;

    return this.http
    .put<Empresa>(
    this.basePath3 + '/' + id,
    datos,
    this.httpOptions
    )
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para actualizar una cotizacion
  updateCotizacion(id, item: Cotizacion): Observable<Cotizacion> {
    let data = `{"empresa": "/api/empresas/${item.empresaId}", "fecha": "${item.fecha}", "valor": ${item.valor}}`;

    return this.http
    .put<Cotizacion>(
    this.basePath4 + '/' + id,
    data,
    this.httpOptions
    )
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para eliminar una empresa
  deleteEmpresa(id) {
    return this.http
    .delete<Empresa>(this.basePath3 + '/' + id, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError));
  }

  // Metodo para eliminar una cotizacion
  deleteCotizacion(id) {
    return this.http
    .delete<Cotizacion>(this.basePath4 + '/' + id, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError));
  }
}
