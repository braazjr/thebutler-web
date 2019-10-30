import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Construtora } from '../../../models/construtora-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { Empresa } from '../../../models/empresa-model';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { SharedService } from '../../../services/shared.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-construtora-cadastro',
  templateUrl: './construtora-cadastro.component.html',
  styleUrls: ['./construtora-cadastro.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ConstrutoraCadastroComponent implements OnInit {

  observable: any;

  construtora: Construtora = new Construtora();
  listaEmpresas: Array<IOption> = [];
  empresaId: string;

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
        this.construtora.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      empresa: ['', [Validators.required, Validators.min(1)]],
      cnpj: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), Validators.pattern(this.cnpjRegex)]],
      nomeFantasia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ativo: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bairro: [{ value: '', disabled: true }, [Validators.required]],
      cidade: [{ value: '', disabled: true }, [Validators.required]],
      estado: [{ value: '', disabled: true }, [Validators.required]],
      cep: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.cepRegex)]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email]],
      telefone: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern(this.telefoneRegex)]],
      complemento: ['', [Validators.maxLength(50)]],
      rua: [{ value: '', disabled: true }, [Validators.required]],
      numero: ['', [Validators.min(1)]]
    });

    this.carregarEmpresas();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('construtoras', this.construtora.id).subscribe(response => {
      this.construtora = response as Construtora;
      this.empresaId = this.construtora.empresa.id.toString();
      this.carregarEmpresas();
    })
  }

  validaCep(value) {
    let cep: string = value.target.value.replace('_', '');
    if (cep.length == 9)
      this.buscaCep(cep.replace('-', ''));
  }

  buscaCep(cep) {
    this.observable = this.defaultService.getDadosCep(cep).subscribe(response => {
      this.construtora.rua = response['logradouro'];
      this.construtora.bairro = response['bairro'];
      this.construtora.cidade = response['localidade'];
      this.construtora.estado = response['uf'];
      this.construtora.complemento = response['complemento'];
    })
  }

  carregarEmpresas() {
    this.defaultService.get('empresas').subscribe(response => {
      let lista = [];
      this.listaEmpresas = (response as Empresa[]).map(emp => {
        if (this.construtora.id && emp.id === this.construtora.empresa.id) {
          return ({ value: emp.id.toString(), label: emp.nomeFantasia, disabled: false })
        }

        return ({ value: emp.id.toString(), label: emp.nomeFantasia, disabled: false })
      });

      // this.idEmpresa = this.construtora.empresa != undefined ? this.construtora.empresa.id : 0;
    });
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      swal('Cadastro de construtora', 'Não é possível salvar a construtora!<br>Existem campos inválidos', 'error');
    } else {
      this.construtora.usuario = this.sharedService.getUsuarioLogged();
      this.construtora.empresa.id = Number(this.empresaId);

      if (!this.construtora.id) {
        this.observable = this.defaultService.salvar('construtoras', this.construtora).subscribe(response => {
          this.construtora = response as Construtora;
          this.toastService.addToast('success', 'Cadastro Construtora!', `Construtora ${this.construtora.nomeFantasia} salva com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Cadastro Construtora!', element.mensagemUsuario);
          });
        })
      } else {
        this.observable = this.defaultService.atualizar('construtoras', this.construtora).subscribe(response => {
          this.construtora = response as Construtora;
          this.toastService.addToast('success', 'Atualização Construtora!', `Construtora ${this.construtora.nomeFantasia} atualizada com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Atualização Construtora!', element.mensagemUsuario);
          });
        })
      }
    }
  }

}
