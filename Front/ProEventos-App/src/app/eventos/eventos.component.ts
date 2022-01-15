
import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/Evento';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[]=[];

  public larguraImg = 120;
  public margemImg = 2;
  public exibirImg = true;
  public _filtroLista='';

  public get filtroLista(): string{
    return this._filtroLista;
  }
  public set filtroLista(value: string){
    this._filtroLista= value;
    this.eventosFiltrados=this.filtroLista ? this.filtrarEventos(this.filtroLista):this.eventos;
  }

  public filtrarEventos(filtrarPor: string):Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : {tema: string; local: string})=> evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(private eventoService: EventoService) {

  }

  //ngOnInit é um metodo que vai ser
  //chamado antes de ser inicializado a aplicação. Antes do HTML ser interpretado
  public ngOnInit(): void {
    this.getEventos();
  }

  public alterarEstadoImg(): void{
    this.exibirImg = !this.exibirImg;
  }


  public getEventos(): void {

    //Vou fazer um get do protocolo http neste URL
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => console.log(console.error),

    });


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
