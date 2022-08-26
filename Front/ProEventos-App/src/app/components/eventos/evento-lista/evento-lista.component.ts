import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/pagination';
import { environment } from '@environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.css']
})
export class EventoListaComponent implements OnInit {

   //Modal
   modalRef?: BsModalRef;

   public eventos: Evento[] = [];
   public eventoId = 0;
   public pagination = {} as Pagination;

   public larguraImg = 120;
   public margemImg = 2;
   public exibirImg = true;
   termoBuscaChanged: Subject<string> = new Subject<string>();

/*    public filtrarEventos(filtrarPor: string):Evento[]{
     filtrarPor = filtrarPor.toLocaleLowerCase();
     return this.eventos.filter(
       (evento : {tema: string; local: string})=> evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
       evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
     )
   } */

   public filtrarEventos(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1500))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            ).subscribe(
              (paginatedResult: PaginatedResult<Evento[]>) => {
                this.eventos = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              (error: any) => {
                this.spinner.hide();
                this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
              }
            )
            .add(() => this.spinner.hide());
        });
    }
    this.termoBuscaChanged.next(evt.value);
  }


   constructor(
     private eventoService: EventoService,
     private modalService: BsModalService,
     private toastr: ToastrService,
     private spinner: NgxSpinnerService,
     private router: Router) {

   }

   //ngOnInit é um metodo que vai ser
   //chamado antes de ser inicializado a aplicação. Antes do HTML ser interpretado
   public ngOnInit(): void {
     this.pagination = {currentPage: 1, itemsPerPage:3, totalItems: 1} as Pagination;
     this.carregarEventos();
   }

   public alterarEstadoImg(): void{
     this.exibirImg = !this.exibirImg;
   }

   public mostraImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/img/imageNotAvailable.jpg';
  }


   public carregarEventos(): void {
    this.spinner.show();

     //Vou fazer um get do protocolo http neste URL
     this.eventoService.getEventos(
                      this.pagination.currentPage,
                      this.pagination.itemsPerPage).subscribe({
       next: (paginatedResult: PaginatedResult<Evento[]>) => {
         this.eventos = paginatedResult.result;
         this.pagination = paginatedResult.pagination;
       },
       error: (error: any) => {
         this.spinner.hide();
         this.toastr.error('Erro ao carregar os Eventos.', 'Erro!')

       },
       complete: () =>this.spinner.hide()

     });
   }

     //Modal
     openModal(event:any, template: TemplateRef<any>, eventoId: number):void {
       event.stopPropagation();
       this.eventoId = eventoId;
       this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
     }

     public pageChanged(event): void {
      this.pagination.currentPage = event.page;
      this.carregarEventos();
    }

     confirm(): void {
       this.modalRef?.hide();
       this.spinner.show();

       this.eventoService.deleteEvento(this.eventoId).subscribe(
        (result: any) => {
          if (result.message === 'Apagado'){
          console.log(result); // Retorna o "Apagado do controler da API". Nesta caso aparece na consola: mesagem: "Apagado". Não é necessario este if. Para tal passar o any do result para string

          this.toastr.success('O Evento foi apagado com sucesso.', 'Apagado!');
          this.spinner.hide();
          this.carregarEventos();
          }


        },
        (error: any) => {
          console.error(error);
          this.toastr.error(`Erro ao tentar apagar o evento ${this.eventoId}`, 'Erro!');
          this.spinner.hide();
        },
        () => this.spinner.hide(),


      );

    }

     decline(): void {
       this.modalRef?.hide();
     }
     detalheEvento(id: number): void{
      this.router.navigate([`eventos/detalhe/${id}`]);
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
