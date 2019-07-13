import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Empresa } from '../../../models/empresa-model';
import { DefaultService } from '../../../services/default.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-empresa-cadastro',
  templateUrl: './empresa-cadastro.component.html',
  styleUrls: ['./empresa-cadastro.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class EmpresaCadastroComponent implements OnInit {

  observable: any;
  position = 'bottom-right';

  empresa: Empresa = new Empresa();

  cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cnpjRegex = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;
  cepRegex = /^\d{5}-\d{3}$/;
  telefoneRegex = /^\(\d{2}\)\d{4}-\d{4}$/;
  formulario: FormGroup;

  constructor(private route: ActivatedRoute, private defaultService: DefaultService, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef, private toastService: ToastService, private sharedService: SharedService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.empresa.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      cnpj: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), Validators.pattern(this.cnpjRegex)]],
      nomeFantasia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ativo: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bairro: [{ value: '', disabled: true }, [Validators.required]],
      cidade: [{ value: '', disabled: true }, [Validators.required]],
      estado: [{ value: '', disabled: true }, [Validators.required]],
      cep: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.cepRegex)]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email]],
      telefone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern(this.telefoneRegex)]],
      complemento: ['', [Validators.maxLength(50)]],
      rua: [{ value: '', disabled: true }, [Validators.required]],
      numero: ['', [Validators.min(1)]]
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.observable = this.defaultService.getById('empresa', this.empresa.id).subscribe(response => {
      this.empresa = response as Empresa;
    })
  }

  validaCep(value) {
    let cep: string = value.target.value.replace('_', '');
    if (cep.length == 9)
      this.buscaCep(cep.replace('-', ''));
  }

  buscaCep(cep) {
    this.observable = this.defaultService.getDadosCep(cep).subscribe(response => {
      this.empresa.rua = response['logradouro'];
      this.empresa.bairro = response['bairro'];
      this.empresa.cidade = response['localidade'];
      this.empresa.estado = response['uf'];
      this.empresa.complemento = response['complemento'];
    })
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      swal('Cadastro de empresa', 'Não é possível salvar a empresa!<br>Existem campos inválidos', 'error');
    } else {
      this.empresa.usuario = this.sharedService.getUsuarioLogged();

      if (!this.empresa.id) {
        this.observable = this.defaultService.salvar('empresa', this.empresa).subscribe(response => {
          this.empresa = response as Empresa;
          this.toastService.addToast('success', 'Cadastro Empresa!', `Empresa ${this.empresa.nomeFantasia} salva com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Cadastro Empresa!', element.mensagemUsuario);
          });
        })
      } else {
        this.observable = this.defaultService.atualizar('empresa', this.empresa).subscribe(response => {
          this.empresa = response as Empresa;
          this.toastService.addToast('success', 'Atualização Empresa!', `Empresa ${this.empresa.nomeFantasia} atualizada com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Atualização Empresa!', element.mensagemUsuario);
          });
        });
      }
    }
  }
}
