import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.css']
})
export class EventoDetalheComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({});

  //Atribuo um objeto vazio mas que é do tipo Evento
  evento = {} as Evento;

  estado = 'post';

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any{
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(
    private formBuilder:FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
    ){
      this.localeService.use('pt-br');
   }

   public carregarEvento():void {
     const eventoIdParam = this.router.snapshot.paramMap.get('id');

     if (eventoIdParam !== null){
      this.spinner.show();

      this.estado ='put'; // Carregamos os eventos quando estamos a editar
      this.eventoService.getEventoById(+eventoIdParam).subscribe({
         next: (evento: Evento) =>{

          //Eu pego cada uma das propriedades dentro do meu objecto evento que eu recebi do meu getEventobyId
           this.evento =  {...evento};
           this.form.patchValue(this.evento);
         },
         error: (error: any) =>{
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar o Evento.', 'Erro!');
          console.error(error);
         },
         complete: () =>{
          this.spinner.hide();
         },
       });


     }
   }



  ngOnInit() {
    this.carregarEvento();
    this.validation();
  }

  public validation():void {

    this.form = this.formBuilder.group(
      {
        tema: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['',Validators.required],
        dataEvento: ['',Validators.required],
        qtdPessoas: ['',[Validators.required, Validators.max(120000)]],
        telefone: ['',Validators.required],
        email: ['',[Validators.required, Validators.email]],
        imagemURL: ['',Validators.required],

      }
    );
  }

  public resetForm(): void{
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched };
  }

  public guardarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {

      if(this.estado === 'post'){
        this.evento =  {...this.form.value}; //Todos os campos do formulario

        this.eventoService.postEvento(this.evento).subscribe({
          next: () => this.toastr.success('Evento guardado com Sucesso!', 'Sucesso'),
          error: (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao guardar o evento', 'Erro');
          },
          complete: () => this.spinner.hide()
        }).add(() => this.spinner.hide());

      }else{
        this.evento =  {id: this.evento.id , ...this.form.value}; //Todos os campos do formulario

        this.eventoService.putEvento(this.evento.id,this.evento).subscribe({
          next: () => this.toastr.success('Evento guardado com Sucesso!', 'Sucesso'),
          error: (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao tentar guardar o evento', 'Erro');
          },
          complete: () => this.spinner.hide()
        }).add(() => this.spinner.hide());
      }
    }
  }

  /*
  public guardarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {

      this.evento = (this.estado === 'post')
                ? {...this.form.value}
                : {id: this.evento.id, ...this.form.value};

      this.eventoService[this.estado+'Evento'](this.evento).subscribe(
        () => this.toastr.success('Evento salvo com Sucesso!', 'Sucesso'),
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro');
        },
        () => this.spinner.hide()
      );
    }
  }
  */
}
