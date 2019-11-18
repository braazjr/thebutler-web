import { DadosGenericoEndereco } from "./dados-generico-endereco-model";
import { Construtora } from "./construtora-model";

export class Condominio extends DadosGenericoEndereco {

    nome: string;
    construtora: Construtora = new Construtora();
    complemento: string;
    
}