import { DadosGenericoHistoricoModel } from "./dados-generico-historico-model";
import { Bloco } from "./bloco-model";
import { Morador } from "./morador-model";

export class Apartamento extends DadosGenericoHistoricoModel {

    ativo: boolean;
    numero: number;
    bloco: Bloco = new Bloco();
    numeroQuartos: number;
    moradores: Morador[] = [];
    
}