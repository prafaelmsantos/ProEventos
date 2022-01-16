
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../../models/Evento';
import { EventoService } from '../../services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {

  //Modal
  modalRef?: BsModalRef;

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

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {

  }

  //ngOnInit é um metodo que vai ser
  //chamado antes de ser inicializado a aplicação. Antes do HTML ser interpretado
  public ngOnInit(): void {
    this.spinner.show();
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
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os Eventos.', 'Erro!')

      },
      complete: () =>this.spinner.hide()

    });
  }

    //Modal
    openModal(template: TemplateRef<any>):void {
      this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    confirm(): void {
      this.modalRef?.hide();
      this.toastr.success('O Evento foi apagado com sucesso!', 'Apagado');
    }

    decline(): void {
      this.modalRef?.hide();
    }



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
