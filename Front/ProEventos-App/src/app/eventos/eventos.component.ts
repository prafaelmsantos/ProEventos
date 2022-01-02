import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  public eventos: any = [];
  public eventosFiltrados: any=[];
  larguraImg: number = 120;
  margemImg: number = 2;
  exibirImg: boolean = true;
  private _filtroLista: string ='';

  public get filtroLista(): string{
    return this._filtroLista;
  }
  public set filtroLista(value: string){
    this._filtroLista= value;
    this.eventosFiltrados=this.filtroLista ? this.filtrarEventos(this.filtroLista):this.eventos;
  }

  filtrarEventos(filtrarPor: string):any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : {tema: string; local: string})=> evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(private http: HttpClient) {

  }

  //ngOnInit é um metodo que vai ser
  //chamado antes de ser inicializado a aplicação. Antes do HTML ser interpretado
  ngOnInit(): void {
    this.getEventos();
  }

  alterarEstadoImg(){
    this.exibirImg = !this.exibirImg;
  }


  public getEventos(): void {
    //Vou fazer um get do protocolo http neste URL
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      response => {
        this.eventos = response;
        this.eventosFiltrados = this.eventos;
      },
      error => console.log(console.error)

    );


/*
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
        Local: 'Mira (Db Angular estatica)'
      }
    ]*/

  }

}
