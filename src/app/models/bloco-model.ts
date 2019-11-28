import { DadosGenericoHistoricoModel } from "./dados-generico-historico-model";
import { Condominio } from "./condominio-model";

export class Bloco extends DadosGenericoHistoricoModel {

    ativo: boolean;
    nome: string;
    numero: number;
    condominio: Condominio = new Condominio();
    
}