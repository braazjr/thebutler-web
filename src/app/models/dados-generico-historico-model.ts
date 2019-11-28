import { Usuario } from "./usuario-model";

export class DadosGenericoHistoricoModel {

    id: number;
    dataHoraCadastro: Date;
    dataHoraModificacao: Date;
    usuario: Usuario;
}