import FreteEnum from "../../enums/FreteEnum.ts";

export default function translateFreteEnum(estado: FreteEnum){
    switch(estado){
        case FreteEnum.CIF:
            return "CIF";
        case FreteEnum.FOB:
            return "FOB";
        case FreteEnum.SEM_FRETE:
            return "Sem frete";
        default:
            return "Desconhecido";
    }
}
