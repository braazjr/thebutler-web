import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RotaCadastroComponent } from './rota-cadastro/rota-cadastro.component';
import { RotaListaComponent } from './rota-lista/rota-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Rotas',
      status: false
    },
    children: [
      {
        path: 'cadastro',
        component: RotaCadastroComponent
      },
      {
        path: 'cadastro/:id',
        component: RotaCadastroComponent
      },
      {
        path: 'lista',
        component: RotaListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RotaRoutingModule { }
