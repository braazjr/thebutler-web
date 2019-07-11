import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstrutoraCadastroComponent } from './construtora-cadastro/construtora-cadastro.component';
import { ConstrutoraListaComponent } from './construtora-lista/construtora-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Construtoras',
      status: false
    },
    children: [
      {
        path: 'cadastro',
        component: ConstrutoraCadastroComponent
      },
      {
        path: 'cadastro/:id',
        component: ConstrutoraCadastroComponent
      },
      {
        path: 'lista',
        component: ConstrutoraListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstrutoraRoutingModule { }
