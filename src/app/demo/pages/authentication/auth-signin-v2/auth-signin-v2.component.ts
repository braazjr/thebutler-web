import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-auth-signin-v2',
  templateUrl: './auth-signin-v2.component.html',
  styleUrls: ['./auth-signin-v2.component.scss']
})
export class AuthSigninV2Component implements OnInit {

  form: any = {
    email: '',
    senha: ''
  }

  isSubmit: boolean;
  alerta: string;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }

  entrar(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    }

    this.spinner.show();
    this.authService.login(this.form.login, this.form.senha)
      .subscribe(() => {
        console.info('-- login efetuado com sucesso!');
      }, error => {
        if (error.status === 0) {
          console.error(this.alerta = 'Ocorreu um erro interno!');
        } else {
          console.error(this.alerta = error);
        }
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
        if (!this.sharedService.isAdmin()) {
          this.router.navigate(['/apartamento/lista']);
        } else {
          this.router.navigate(['/']);
        }
      });
  }

}
