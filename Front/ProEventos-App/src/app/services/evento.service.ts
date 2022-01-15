import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable(
  /*//Eu posso injectar esta classe em qualquer lugar
  // como coloquei o eventoService na app.module não é preciso colocar aqui
  {
  providedIn: 'root'
  }*/
)
export class EventoService {
  baseURL = 'https://localhost:5001/api/eventos';

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]>{

    return this.http.get<Evento[]>(this.baseURL);

  }

  public getEventosByTema(tema: string): Observable<Evento[]>{

    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`);

  }

  public getEventoById(id: number): Observable<Evento>{

    return this.http.get<Evento>(`${this.baseURL}/${id}`);

  }

}
