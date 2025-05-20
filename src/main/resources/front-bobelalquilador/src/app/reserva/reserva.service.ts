import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Alquiler {
  alquilerId: {
    nombre_maquina: string;
    fechaInicio: string;
    fechaFin: string;
  };
  precioTotal: number;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private apiUrl = '/api/alquileres/reservar';

  constructor(private http: HttpClient) {}

  reservar(
    maquina: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<Alquiler> {
    const params = new HttpParams()
      .set('maquina', maquina)
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    return this.http.post<Alquiler>(this.apiUrl, null, { params })
      .pipe(
        catchError(err => throwError(() => err))
      );
  }
}
