import { DadosGenericoEndereco } from "./dados-generico-endereco-model";
import { Empresa } from "./empresa-model";

export class Construtora extends DadosGenericoEndereco {

    cnpj: string;
    nomeFantasia: string;
    razaoSocial: string;
    empresa: Empresa = new Empresa();
    complemento: string;

}