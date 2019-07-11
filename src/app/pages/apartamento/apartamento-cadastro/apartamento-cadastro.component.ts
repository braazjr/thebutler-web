import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Apartamento } from '../../../models/apartamento-model';
import { IOption } from 'ng-select';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { Condominio } from '../../../models/condominio-model';
import swal from 'sweetalert2';
import { SharedService } from '../../../services/shared.service';
import { ToastService } from '../../../services/toast.service';
import { Bloco } from '../../../models/bloco-model';

@Component({
  selector: 'app-apartamento-cadastro',
  templateUrl: './apartamento-cadastro.component.html',
  styleUrls: ['./apartamento-cadastro.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ApartamentoCadastroComponent implements OnInit {

  observable: any;

  apartamento: Apartamento = new Apartamento();
  listaBlocos: Array<IOption> = [];
  blocoId: string;

  cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cnpjRegex = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;
  cepRegex = /^\d{5}-\d{3}$/;
  telefoneRegex = /^\(\d{2}\)\d{4}-\d{4}$/;
  formulario: FormGroup;

  constructor(private route: ActivatedRoute, private defaultService: DefaultService, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef, private sharedService: SharedService, private toastService: ToastService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.apartamento.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      bloco: ['', [Validators.required, Validators.min(1)]],
      ativo: ['', [Validators.required]],
      numero: ['', [Validators.required, Validators.min(1)]]
    });

    this.carregarBlocos();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('apartamentos', this.apartamento.id).subscribe(response => {
      this.apartamento = response as Apartamento;
      this.blocoId = this.apartamento.bloco.id.toString();
      this.carregarBlocos();
    })
  }

  carregarBlocos() {
    this.defaultService.get('bloco').subscribe(response => {
      this.listaBlocos = (response as Bloco[]).map(bloco => {
        if (this.apartamento.id && bloco.id === this.apartamento.bloco.id) {
          return ({ value: bloco.id.toString(), label: bloco.condominio.nome + ' - ' + bloco.nome, selected: true })
        }

        return ({ value: bloco.id.toString(), label: bloco.condominio.nome + ' - ' + bloco.nome })
      });
    }, error => console.error(error));
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      swal('Cadastro de apartamento', 'Não é possível salvar o apartamento!<br>Existem campos inválidos', 'error');
    } else {
      this.apartamento.usuario = this.sharedService.getUsuarioLogged();
      this.apartamento.bloco.id = Number(this.blocoId);

      if (!this.apartamento.id) {
        this.observable = this.defaultService.salvar('apartamento', this.apartamento).subscribe(response => {
          this.apartamento = response as Apartamento;
          this.toastService.addToast('success', 'Cadastro Apartamento!', `Apartamento ${this.apartamento.numero} salvo com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Cadastro Apartamento!', element.mensagemUsuario);
          });
        }, () => this.router.navigate([`/ficha/${this.apartamento.id}`]))
      } else {
        this.observable = this.defaultService.atualizar('apartamento', this.apartamento).subscribe(response => {
          this.apartamento = response as Apartamento;
          this.toastService.addToast('success', 'Atualização Apartamento!', `Apartamento ${this.apartamento.numero} atualizado com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Atualização Apartamento!', element.mensagemUsuario);
          });
        }, () => this.router.navigate([`/ficha/${this.apartamento.id}`]))
      }
    }
  }
}
