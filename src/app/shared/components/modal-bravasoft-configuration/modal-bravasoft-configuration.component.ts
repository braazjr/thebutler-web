import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from 'src/app/services/electron.service';
import { DefaultService } from './../../../services/default.service';
import { SharedService } from './../../shared.service';
import { EmpresaService } from './../../../services/empresa.service';

@Component({
  selector: 'modal-bravasoft-configuration',
  templateUrl: './modal-bravasoft-configuration.component.html',
  styleUrls: ['./modal-bravasoft-configuration.component.scss']
})
export class ModalBravasoftConfigurationComponent implements OnInit {

  @ViewChild('modalBravaSoft', { static: false }) modalBravaSoft: any;

  configuration = {
    bsPrintPath: '',
    projectPath: ''
  }

  alert = {
    message: '',
    type: ''
  }

  isSubmit = false

  constructor(
    private electronService: ElectronService,
    private empresaService: EmpresaService,
    private sharedService: SharedService,
    private defaultService: DefaultService
  ) { }

  ngOnInit() {
    if (!this.electronService.ipcRenderer) {
      return;
    }

    const usuario = this.sharedService.getUsuarioLogged()

    this.defaultService.getById('empresas', usuario.empresa.id)
      .subscribe(
        empresa => this.configuration = (empresa as any).empresaConfig.bravaSoftConfiguration
      )
  }

  public show(): void {
    this.modalBravaSoft.show();
  }

  public hide(): void {
    this.modalBravaSoft.hide();
  }

  salvar(form, modal) {
    if (form.invalid) {
      this.isSubmit = true
      return;
    }

    if (!this.electronService.ipcRenderer) {
      return;
    }

    this.empresaService.saveBravaSoftConfiguration(this.configuration)
      .subscribe(
        () => this.alert = { message: 'Configurações atualizadas com sucesso!', type: 'success' },
        () => this.alert = { message: 'Houve um erro ao tentar atualizar as configurações', type: 'danger' },
        () => {
          setInterval(() => {
            this.alert = undefined
          }, 5000)

          modal.hide()
        }
      )
  }
}
