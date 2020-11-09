import { DadosGenericoHistoricoModel } from './dados-generico-historico-model';

export class Passageiro extends DadosGenericoHistoricoModel {

    id: string;
    documento: string;
    ativo: boolean;
    celular: string;
    email: string;
    nome: string;
    telefone: string;
    observacao: string;
    foto64: string;
    fotoUrl: string;
    documentos?: any[];
    empresa?: any;

}
