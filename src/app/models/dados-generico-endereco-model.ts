import { DadosGenericoHistoricoModel } from "./dados-generico-historico-model";

export class DadosGenericoEndereco extends DadosGenericoHistoricoModel {

    ativo: boolean = false;
    bairro: string;
    cep: string;
    cidade: string;
    email: string;
    estado: string;
    numero: number;
    rua: string;
    telefone: string;
}