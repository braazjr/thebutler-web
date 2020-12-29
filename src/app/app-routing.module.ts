import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { SecurityGuard } from './pages/security/security.guard';
import { LetsEncryptComponent } from './letsencripty';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [SecurityGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard/home',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'empresa',
        loadChildren: () => import('./pages/empresa/empresa.module').then(module => module.EmpresaModule)
      },
      {
        path: 'condominio',
        loadChildren: () => import('./pages/condominio/condominio.module').then(module => module.CondominioModule)
      },
      {
        path: 'bloco',
        loadChildren: () => import('./pages/bloco/bloco.module').then(module => module.BlocoModule)
      },
      {
        path: 'apartamento',
        loadChildren: () => import('./pages/apartamento/apartamento.module').then(module => module.ApartamentoModule)
      },
      {
        path: 'ficha',
        loadChildren: () => import('./pages/ficha/ficha.module').then(module => module.FichaModule)
      },
      {
        path: 'morador',
        loadChildren: () => import('./pages/morador/morador.module').then(module => module.MoradorModule)
      },
      {
        path: 'usuario',
        loadChildren: () => import('./pages/usuario/usuario.module').then(module => module.UsuarioModule)
      },
      {
        path: 'passageiro',
        loadChildren: () => import('./pages/passageiro/passageiro.module').then(module => module.PassageiroModule)
      },
      {
        path: 'rota',
        loadChildren: () => import('./pages/rota/rota.module').then(module => module.RotaModule)
      },
      {
        path: 'viagem',
        loadChildren: () => import('./pages/viagem/viagem.module').then(module => module.ViagemModule)
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth/login',
        loadChildren: () => import('./pages/security/login/login.module').then(module => module.LoginModule)
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: '.well-known/acme-challenge/2BDBhUu5GvKfm2YiYvqWl7KNFSVq2s2Mdh8NqzPoqaI',
        component: LetsEncryptComponent
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth/login',
        loadChildren: () => import('./pages/security/login/login.module').then(module => module.LoginModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
