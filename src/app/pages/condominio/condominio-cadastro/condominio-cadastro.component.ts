import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Condominio } from '../../../models/condominio-model';
import { IOption } from 'ng-select';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Empresa } from 'src/app/models/empresa-model';

@Component({
  selector: 'app-condominio-cadastro',
  templateUrl: './condominio-cadastro.component.html',
  styleUrls: ['./condominio-cadastro.component.scss']
})
export class CondominioCadastroComponent implements OnInit {

  condominio: Condominio = new Condominio();
  listaEmpresas: Array<IOption> = [];
  empresaId: string = '0';

  cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  isSubmit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private cdr: ChangeDetectorRef,
    public sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.condominio.id = params['id'];
        this.getById();
      } else {
        this.condominio.ativo = true;
      }
    });

    if (this.sharedService.isAdmin()) {
      this.carregarEmpresas();
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('condominios', this.condominio.id)
      .subscribe(response => {
        this.condominio = response as Condominio;
        this.empresaId = this.condominio.empresa.id.toString();

        if (this.sharedService.isAdmin()) {
          this.carregarEmpresas();
        }
      });
  }

  validaCep(value) {
    let cep: string = value.target.value.replace('_', '');
    if (cep.length == 9)
      this.buscaCep(cep.replace('-', ''));
  }

  buscaCep(cep) {
    this.defaultService.getDadosCep(cep)
      .subscribe(response => {
        this.condominio.rua = response['logradouro'];
        this.condominio.bairro = response['bairro'];
        this.condominio.cidade = response['localidade'];
        this.condominio.estado = response['uf'];
        this.condominio.complemento = response['complemento'];
      });
  }

  carregarEmpresas() {
    this.defaultService.get('empresas')
      .subscribe(response => {
        this.listaEmpresas = (response as Empresa[]).map(emp => ({ value: emp.id.toString(), label: emp.nomeFantasia }));
        this.listaEmpresas.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  salvar(form) {
    if (form.invalid) {
      this.isSubmit = true;
      return;
    } else {
      this.condominio['empresaId'] = this.empresaId;

      if (!this.condominio.id) {
        this.defaultService.salvar('condominios', this.condominio)
          .subscribe(response => {
            this.condominio = response as Condominio;
            this.router.navigate(['/condominio/lista']);
          });
      } else {
        this.defaultService.atualizar('condominios', this.condominio)
          .subscribe(response => {
            this.condominio = response as Condominio;
            this.router.navigate(['/condominio/lista']);
          });
      }
    }
  }
}
