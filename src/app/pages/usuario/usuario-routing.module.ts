import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioListaComponent } from './usuario-lista/usuario-lista.component';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Usuarios',
      status: false
    },
    children: [
      {
        path: 'lista',
        component: UsuarioListaComponent
      },
      {
        path: 'cadastro/:id',
        component: UsuarioCadastroComponent
      },
      {
        path: 'cadastro',
        component: UsuarioCadastroComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoradorRoutingModule { }
