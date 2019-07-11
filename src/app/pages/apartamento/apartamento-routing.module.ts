import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartamentoCadastroComponent } from './apartamento-cadastro/apartamento-cadastro.component';
import { ApartamentoListaComponent } from './apartamento-lista/apartamento-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Apartamentos',
      status: false
    },
    children: [
      {
        path: 'cadastro',
        component: ApartamentoCadastroComponent
      },
      {
        path: 'cadastro/:id',
        component: ApartamentoCadastroComponent
      },
      {
        path: 'lista',
        component: ApartamentoListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartamentoRoutingModule { }
