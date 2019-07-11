import { Empresa } from './empresa-model';

export class Usuario {

    id: number;
    login: string;
    primeiroNome: string;
    ultimoNome: string;
    ativo: boolean;
    senha: string;
    empresa: Empresa = new Empresa();
    permissoes: any[] = [];

    senhaNova: string;
    confirmaSenha?: string;
}
