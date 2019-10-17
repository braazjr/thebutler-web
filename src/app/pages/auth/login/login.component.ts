import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario-model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  observable: any;

  alerta: String = undefined;
  usuario: Usuario = new Usuario();

  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
  }

  logar() {
    this.observable = this.authService.login(this.usuario.login, this.usuario.senha).subscribe(() => {
      console.info('Login efetuado com sucesso!');
    }, error => {
      if (error.status === 0) {
        console.error(this.alerta = 'Ocorreu um erro interno!');
      } else {
        console.error(this.alerta = error);
      }
    }, () => {
      if (!this.sharedService.isAdmin()) {
        this.router.navigate(['/apartamento/lista']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
