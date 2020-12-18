import { EmpresaSub } from './empresa-sub-model';

export class Usuario {

    id: String;
    email: String
    username: String;
    nome: String;
    senha: String;
    ativo: Boolean= true;
    permissoes: String[] = []
    empresa: EmpresaSub
}