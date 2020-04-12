import { Apartamento } from './apartamento-model';
import { Morador } from './morador-model';

export class Ficha {

    id: String
    apartamento: Apartamento = new Apartamento()
    moradores: Morador[] = []
}