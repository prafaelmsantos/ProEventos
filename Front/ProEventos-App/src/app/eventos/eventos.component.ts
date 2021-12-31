import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  public eventos: any;

  constructor(private http: HttpClient) {

  }

  //ngOnInit é um metodo que vai ser
  //chamado antes de ser inicializado a aplicação. Antes do HTML ser interpretado
  ngOnInit(): void {
    this.getEventos();
  }

  public getEventos(): void {
    //Vou fazer um get do protocolo http neste URL
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      response => this.eventos = response,
      error => console.log(console.error)

    );


    this.eventos= [
      {
        Tema: 'Angular',
        Local: 'Praia de Mira (Db Angular estatica)'
      },
      {
        Tema: '.Net 5',
        Local: 'Coimbra (Db Angular estatica)'
      },
      {
        Tema: 'Curso Completo',
        Local: 'Mira '
      }
    ]

  }

}
