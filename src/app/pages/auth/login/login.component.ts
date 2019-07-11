import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario-model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  observable: any;

  alerta: String = undefined;
  usuario: Usuario = new Usuario();

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  logar() {
    this.observable = this._authService.login(this.usuario.login, this.usuario.senha).subscribe(() => {
      console.info('Login efetuado com sucesso!');
    }, error => {
      if (error.status === 0) {
        console.error(this.alerta = 'Ocorreu um erro interno!');
      } else {
        console.error(this.alerta = error);
      }
    }, () => {
      this._router.navigate(['/']);
    });
  }

}
