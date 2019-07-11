import { DadosGenericoEndereco } from "./dados-generico-endereco-model";

export class Empresa extends DadosGenericoEndereco {

    cnpj: string;
    nomeFantasia: string;
    nomeSocial: string;
    complemento: string;
}