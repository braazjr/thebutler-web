import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'Dash',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-layout-sidebar-left'
      }
    ]
  },
  {
    label: 'Gestão de pessoas',
    main: [
      {
        state: 'gestaoPessoas',
        short_label: 'GesPes',
        name: 'Gestão de pessoas',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'empresa',
            short_label: 'Emp',
            name: 'Empresas',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            profiles: ['ADMIN'],
            children: [
              {
                state: 'lista',
                name: 'Lista'
              },
              {
                state: 'cadastro',
                name: 'Novo Cadastro'
              }
            ]
          },
          {
            state: 'construtora',
            short_label: 'Cons',
            name: 'Construtoras',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            children: [
              {
                state: 'lista',
                name: 'Lista'
              },
              {
                state: 'cadastro',
                name: 'Novo Cadastro'
              }
            ]
          },
          {
            state: 'condominio',
            short_label: 'Cond',
            name: 'Condomínios',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            children: [
              {
                state: 'lista',
                name: 'Lista'
              },
              {
                state: 'cadastro',
                name: 'Novo Cadastro'
              }
            ]
          },
          {
            state: 'bloco',
            short_label: 'Blo',
            name: 'Blocos',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            children: [
              {
                state: 'lista',
                name: 'Lista'
              },
              {
                state: 'cadastro',
                name: 'Novo Cadastro'
              }
            ]
          },
          {
            state: 'apartamento',
            short_label: 'Apart',
            name: 'Apartamentos',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            children: [
              {
                state: 'lista',
                name: 'Lista'
              },
              {
                state: 'cadastro',
                name: 'Novo Cadastro'
              }
            ]
          },
          {
            state: 'morador',
            short_label: 'Apart',
            name: 'Moradores',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            children: [
              {
                state: 'lista',
                name: 'Lista'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Controle de Acesso',
    main: [
      {
        state: 'controleAcesso',
        short_label: 'ContAce',
        name: 'Controle de Acesso',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'usuario',
            short_label: 'Usu',
            name: 'Usuário',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            children: [
              {
                state: 'lista',
                name: 'Lista'
              },
              {
                state: 'cadastro',
                name: 'Novo Cadastro'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Bus Control',
    main: [
      {
        state: 'busControl',
        short_label: 'BusContr',
        name: 'Bus Control',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'rota',
            short_label: 'Rotas',
            name: 'Rota',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            children: [
              {
                state: 'lista',
                name: 'Lista'
              },
              {
                state: 'cadastro',
                name: 'Novo Cadastro'
              }
            ]
          },
          {
            state: 'viagem',
            short_label: 'Viagens',
            name: 'Viagens',
            type: 'sub',
            icon: 'ti-layout-grid2-alt',
            children: [
              {
                state: 'lista',
                name: 'Lista'
              }
            ]
          }
        ]
      }
    ]
  },
];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }
}
