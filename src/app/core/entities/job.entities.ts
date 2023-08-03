import { Entity } from "./entity.entities";

export interface Job extends Entity {
    descricao: string;
    dataMaxima: Date;
    duracao: string;
}
