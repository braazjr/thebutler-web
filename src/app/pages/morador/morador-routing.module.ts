import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoradorListaComponent } from './morador-lista/morador-lista.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Moradores',
      status: false
    },
    children: [
      {
        path: 'lista',
        component: MoradorListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoradorRoutingModule { }
