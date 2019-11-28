import { Empresa } from './empresa-model';

export class Usuario {

    id: number;
    login: string;
    nome: string;
    ativo: boolean;
    senha: string;
    empresa: Empresa = new Empresa();
    permissoes: any[] = [];
}
