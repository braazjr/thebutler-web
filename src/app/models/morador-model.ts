import { DadosGenericoHistoricoModel } from './dados-generico-historico-model';

export class Morador extends DadosGenericoHistoricoModel {

    id: string;
    documento: string;
    ativo: boolean;
    celular: string;
    email: string;
    nome: string;
    telefone: string;
    placaCarro: string;
    observacao: string;
    parentesco: string;
    tipoDocumento: string;
    tipoMorador: string;
    foto64: string;
    fotoUrl: string;
    apartamentoId?: any;
    documentos?: any[];
    apartamento?: any;

}
