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

  createEmpresa(item): Observable<Empresa> {
    // Se modifican los nombres de los campos a enviar para que sean compatibles con los del servidor
    let datos = `{"nombre": "${item.nombre}", "logo": "${item.logo}", "sector": "${item.sector}",
    "direccion": "${item.direccion}", "url": "${item.url}", "destacada": ${item.destacada}}`;

    return this.http
    .post<Empresa>(this.basePath1, datos, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError));
  }

  createCotizacion(item): Observable<Cotizacion> {
    // Se modifican los nombres de los campos a enviar para que sean compatibles con los del servidor
    let datos = `{"empresaId": ${item.empresaId}, "fecha": "${item.fecha}", "valor": ${item.valor}}`;

    return this.http
    .post<Cotizacion>(this.basePath2, datos, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError));
  }

  getEmpresa(id): Observable<Empresa> {
    return this.http
    .get<Empresa>(this.basePath1 + '/' + id)
    .pipe(retry(2), catchError(this.handleError));
  }

  getCotizacion(id): Observable<Cotizacion> {
    let id_num = Number(id);
    return this.http
    .get<Cotizacion>(this.basePath2 + '/' + id_num)
    .pipe(retry(2), catchError(this.handleError));
  }

  comprobarNombreEmpresas(params): Observable<Empresa[]> {
    return this.http
    .get<Empresa[]>(this.basePath1 + '?nombre='+ params)
    .pipe(retry(2), catchError(this.handleError));
  }

  comprobarFechaCotizacion(id, params): Observable<Cotizacion[]> {
    return this.http
    .get<Cotizacion[]>(this.basePath1 + '/' + id + '/cotizaciones' + '?fecha='+ params)
    .pipe(retry(2), catchError(this.handleError));
  }

  getEmpresasList(params): Observable<Empresa[]> {
    return this.http
    .get<Empresa[]>(this.basePath1 + params)
    .pipe(retry(2), catchError(this.handleError));
  }

  getListaCotizacionesEmpresa(id, params): Observable<Cotizacion[]> {
    let id_num = Number(id);
    console.log(id_num);
    console.log(id);
    return this.http
    .get<Cotizacion[]>(this.basePath1 + '/' + id_num + '/cotizaciones' + params)
    .pipe(retry(2), catchError(this.handleError));
  }

  updateEmpresa(id, item): Observable<Empresa> {
    let datos = `{"nombre": "${item.nombre}", "logo": "${item.logo}", "sector": "${item.sector}",
    "direccion": "${item.direccion}", "url": "${item.url}", "destacada": ${item.destacada}}`;

    return this.http
    .put<Empresa>(
    this.basePath1 + '/' + id,
    datos,
    this.httpOptions
    )
    .pipe(retry(2), catchError(this.handleError));
  }

  updateCotizacion(id, item: Cotizacion): Observable<Cotizacion> {
    let data = `{"empresaId": ${item.empresaId}, "fecha": "${item.fecha}", "valor": ${item.valor}}`;

    return this.http
    .put<Cotizacion>(
    this.basePath2 + '/' + id,
    data,
    this.httpOptions
    )
    .pipe(retry(2), catchError(this.handleError));
  }

  deleteEmpresa(id) {
    return this.http
    .delete<Empresa>(this.basePath1 + '/' + id, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError));
  }

  deleteCotizacion(id) {
    return this.http
    .delete<Cotizacion>(this.basePath2 + '/' + id, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError));
  }
}
