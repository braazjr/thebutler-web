import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any = {
    email: '',
    senha: ''
  }

  isSubmit: boolean;
  alerta: string;

  constructor(
    private authService: AuthService,
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
        this.router.navigate(['/dashboard/home']);
      });
  }

}
