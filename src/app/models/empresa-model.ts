import { DadosGenericoEndereco } from "./dados-generico-endereco-model";
import { EmpresaConfig } from './empresa-config';

export class Empresa extends DadosGenericoEndereco {

    cnpj: string;
    nomeFantasia: string;
    razaoSocial: string;
    complemento: string;
    empresaConfig: EmpresaConfig = new EmpresaConfig();
}