import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
  profiles?: string[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'feather icon-monitor',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        icon: 'fa fa-home',
        url: '/dashboard/home',
        breadcrumbs: false
      },
      {
        id: 'dados-mestre',
        title: 'Dados mestre',
        type: 'collapse',
        icon: 'fa fa-stream',
        children: [
          {
            id: 'empresa',
            title: 'Empresas',
            type: 'collapse',
            breadcrumbs: false,
            profiles: ['ADMIN'],
            children: [
              {
                id: 'empresa-lista',
                title: 'Lista',
                type: 'item',
                url: '/empresa/lista',
                breadcrumbs: false
              },
              {
                id: 'empresa-cadastro',
                title: 'Cadastro',
                type: 'item',
                url: '/empresa/cadastro',
                breadcrumbs: false
              }
            ]
          },
          {
            id: 'condominio',
            title: 'Condomínios',
            type: 'collapse',
            breadcrumbs: false,
            children: [
              {
                id: 'condominio-lista',
                title: 'Lista',
                type: 'item',
                url: '/condominio/lista',
                breadcrumbs: false
              },
              {
                id: 'condominio-cadastro',
                title: 'Cadastro',
                type: 'item',
                url: '/condominio/cadastro',
                breadcrumbs: false
              }
            ]
          },
          {
            id: 'bloco',
            title: 'Blocos',
            type: 'collapse',
            breadcrumbs: false,
            children: [
              {
                id: 'bloco-lista',
                title: 'Lista',
                type: 'item',
                url: '/bloco/lista',
                breadcrumbs: false
              },
              {
                id: 'bloco-cadastro',
                title: 'Cadastro',
                type: 'item',
                url: '/bloco/cadastro',
                breadcrumbs: false
              }
            ]
          },
          {
            id: 'apartamento',
            title: 'Apartamentos',
            type: 'collapse',
            breadcrumbs: false,
            children: [
              {
                id: 'apartamento-lista',
                title: 'Lista',
                type: 'item',
                url: '/apartamento/lista',
                breadcrumbs: false
              },
              {
                id: 'apartamento-cadastro',
                title: 'Cadastro',
                type: 'item',
                url: '/apartamento/cadastro',
                breadcrumbs: false
              }
            ]
          },
          {
            id: 'morador',
            title: 'Moradores',
            type: 'collapse',
            breadcrumbs: false,
            children: [
              {
                id: 'morador-lista',
                title: 'Lista',
                type: 'item',
                url: '/morador/lista',
                breadcrumbs: false
              }
            ]
          }
        ]
      },
      {
        id: 'controle-acesso',
        title: 'Controle de acesso',
        type: 'collapse',
        icon: 'fa fa-users',
        children: [
          {
            id: 'usuario',
            title: 'Usuários',
            type: 'collapse',
            breadcrumbs: false,
            children: [
              {
                id: 'usuario-lista',
                title: 'Lista',
                type: 'item',
                url: '/usuario/lista',
                breadcrumbs: false
              },
              {
                id: 'usuario-cadastro',
                title: 'Cadastro',
                type: 'item',
                url: '/usuario/cadastro',
                breadcrumbs: false
              }
            ]
          }
        ]
      },
      {
        id: 'buscontrol',
        title: 'BUSControl',
        type: 'collapse',
        icon: 'fa fa-bus',
        children: [
          {
            id: 'rota',
            title: 'Rotas',
            type: 'collapse',
            breadcrumbs: false,
            children: [
              {
                id: 'rota-lista',
                title: 'Lista',
                type: 'item',
                url: '/rota/lista',
                breadcrumbs: false
              },
              {
                id: 'rota-cadastro',
                title: 'Cadastro',
                type: 'item',
                url: '/rota/cadastro',
                breadcrumbs: false
              }
            ]
          },
          {
            id: 'viagem',
            title: 'Viagens',
            type: 'item',
            breadcrumbs: false,
            url: '/viagem/lista'
          }
        ]
      }
    ]
  }
];

@Injectable()
export class NavigationItem {

  public get() {
    return NavigationItems;
  }
}
