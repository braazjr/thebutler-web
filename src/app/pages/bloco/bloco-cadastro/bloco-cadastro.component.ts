import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Bloco } from '../../../models/bloco-model';
import { IOption } from 'ng-select';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { Condominio } from '../../../models/condominio-model';
import swal from 'sweetalert2';
import { SharedService } from '../../../services/shared.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-bloco-cadastro',
  templateUrl: './bloco-cadastro.component.html',
  styleUrls: ['./bloco-cadastro.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class BlocoCadastroComponent implements OnInit {

  observable: any;

  bloco: Bloco = new Bloco();
  listaCondominios: Array<IOption> = [];
  condominioId: string;

  cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cnpjRegex = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;
  cepRegex = /^\d{5}-\d{3}$/;
  telefoneRegex = /^\(\d{2}\)\d{4}-\d{4}$/;
  formulario: FormGroup;

  constructor(private route: ActivatedRoute, private defaultService: DefaultService, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef, private sharedService: SharedService, private toastService: ToastService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.bloco.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      condominio: ['', [Validators.required, Validators.min(1)]],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      ativo: ['', [Validators.required]],
      numero: ['', [Validators.min(1)]]
    });

    this.carregarCondominios();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('bloco', this.bloco.id).subscribe(response => {
      this.bloco = response as Bloco;
      this.condominioId = this.bloco.condominio.id.toString();
      this.carregarCondominios();
    })
  }

  carregarCondominios() {
    this.defaultService.get('condominio').subscribe(response => {
      this.listaCondominios = (response as Condominio[]).map(cond => {
        if (this.bloco.id && cond.id === this.bloco.condominio.id) {
          return ({ value: cond.id.toString(), label: cond.construtora.nomeFantasia + ' - ' + cond.nome, selected: true })
        }

        return ({ value: cond.id.toString(), label: cond.construtora.nomeFantasia + ' - ' + cond.nome })
      });
    }, error => console.error(error));
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      swal('Cadastro de bloco', 'Não é possível salvar o bloco!<br>Existem campos inválidos', 'error');
    } else {
      this.bloco.usuario = this.sharedService.getUsuarioLogged();
      this.bloco.condominio.id = Number(this.condominioId);

      if (!this.bloco.id) {
        this.observable = this.defaultService.salvar('bloco', this.bloco).subscribe(response => {
          this.bloco = response as Bloco;
          this.toastService.addToast('success', 'Cadastro Bloco!', `Bloco ${this.bloco.nome} salvo com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Cadastro Bloco!', element.mensagemUsuario);
          });
        })
      } else {
        this.observable = this.defaultService.atualizar('bloco', this.bloco).subscribe(response => {
          this.bloco = response as Bloco;
          this.toastService.addToast('success', 'Atualização Bloco!', `Bloco ${this.bloco.nome} atualizado com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Atualização Bloco!', element.mensagemUsuario);
          });
        })
      }
    }
  }
}
