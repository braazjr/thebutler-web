import { Usuario } from "./usuario-model";

export class DadosGenericoHistoricoModel {

    id: string;
    dataHoraCadastro: Date;
    dataHoraModificacao: Date;
    usuario: Usuario;
}