import { DadosGenericoEndereco } from "./dados-generico-endereco-model";
import { Empresa } from './empresa-model';

export class Condominio extends DadosGenericoEndereco {

    nome: string;
    empresa: Empresa = new Empresa();
    complemento: string;
    
}