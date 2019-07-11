import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViagemListaComponent } from './viagem-lista/viagem-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Viagens',
      status: false
    },
    children: [
      {
        path: 'lista',
        component: ViagemListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViagemRoutingModule { }
