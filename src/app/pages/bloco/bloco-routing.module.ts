import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlocoCadastroComponent } from './bloco-cadastro/bloco-cadastro.component';
import { BlocoListaComponent } from './bloco-lista/bloco-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Blocos',
      status: false
    },
    children: [
      {
        path: 'cadastro',
        component: BlocoCadastroComponent
      },
      {
        path: 'cadastro/:id',
        component: BlocoCadastroComponent
      },
      {
        path: 'lista',
        component: BlocoListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlocoRoutingModule { }
