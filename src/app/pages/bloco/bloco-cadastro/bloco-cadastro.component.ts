import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Bloco } from '../../../models/bloco-model';
import { IOption } from 'ng-select';
import { ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { Condominio } from '../../../models/condominio-model';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-bloco-cadastro',
  templateUrl: './bloco-cadastro.component.html',
  styleUrls: ['./bloco-cadastro.component.scss']
})
export class BlocoCadastroComponent implements OnInit {

  bloco: Bloco = new Bloco();
  listaCondominios: Array<IOption> = [];
  condominioId: string = '0';

  cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  isSubmit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.bloco.id = params['id'];
        this.getById();
      }
    });

    this.carregarCondominios();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('blocos', this.bloco.id)
      .subscribe(response => {
        this.bloco = response as Bloco;
        this.condominioId = this.bloco.condominio.id.toString();
        this.carregarCondominios();
      });
  }

  carregarCondominios() {
    this.defaultService.get('condominios')
      .subscribe(response => {
        this.listaCondominios = (response as Condominio[]).map(cond => ({ value: cond.id.toString(), label: cond.empresa.nomeFantasia + ' - ' + cond.nome }));
        this.listaCondominios.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  salvar(form) {
    if (form.invalid) {
      this.isSubmit = true;
      return;
    } else if (!this.bloco.nome && !this.bloco.numero) {
      this.isSubmit = true;
      this.toastService.addToast('error', 'Cadastro Bloco!', 'O nome ou número deve ser preenchido!');
    } else {
      this.bloco.usuario = this.sharedService.getUsuarioLogged();
      this.bloco.condominio.id = Number(this.condominioId);

      if (!this.bloco.id) {
        this.defaultService.salvar('blocos', this.bloco)
          .subscribe(response => {
            this.bloco = response as Bloco;
            this.toastService.addToast('success', 'Cadastro Bloco!', `Bloco ${this.bloco.nome} salvo com sucesso!`);
          });
      } else {
        this.defaultService.atualizar('blocos', this.bloco)
          .subscribe(response => {
            this.bloco = response as Bloco;
            this.toastService.addToast('success', 'Atualização Bloco!', `Bloco ${this.bloco.nome} atualizado com sucesso!`);
          });
      }
    }
  }
}
