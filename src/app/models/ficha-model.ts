import { Apartamento } from './apartamento-model';
import { Morador } from './morador-model';

export class Ficha {

    id: string
    apartamento: Apartamento = new Apartamento()
    moradores: Morador[] = []
    documentos: any[] = []
}