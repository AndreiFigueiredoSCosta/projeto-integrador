import useView from "../../../../../hooks/useView.ts";
import {Radio} from "../../../../../components/form/misc/Radio";
import React from "react";
import DestinoEnum from "../../../../../enums/DestinoEnum.ts";
import translateDestinoEnum from "../../../../../utils/translators/translateDestinoEnum.ts";
import TopBarContent from "../../../../../components/table/TopBarContent";

type RequisicaoKanbanBarContentProps  = {
    destino: string,
    setDestino: React.Dispatch<React.SetStateAction<string>>
}

export default function RequisicaoKanbanBarContent({
                                                       setDestino,
                                                       destino } : RequisicaoKanbanBarContentProps){
    const { refreshView } = useView();

    return (
        <TopBarContent
            hasPagination={false}
            hasSearch={true}
            rightSideContent={
                <div style={{
                    display: "flex"
                }}>
                    <Radio
                        size={"large"}
                        selected={destino === DestinoEnum.VENDA}
                        onClick={() => {
                            refreshView();
                            return setDestino(DestinoEnum.VENDA)
                        }}
                    >
                        {DestinoEnum.VENDA}
                    </Radio>

                    <Radio
                        size={"large"}
                        selected={destino === DestinoEnum.ESTOQUE}
                        onClick={() => {
                            refreshView();
                            return setDestino(DestinoEnum.ESTOQUE)
                        }}
                    >
                        {DestinoEnum.ESTOQUE}
                    </Radio>

                    <Radio
                        size={"large"}
                        selected={destino === DestinoEnum.VENDA_ESTOQUE}
                        onClick={() => {
                            refreshView();
                            return setDestino(DestinoEnum.VENDA_ESTOQUE)
                        }}
                    >
                        {translateDestinoEnum(DestinoEnum.VENDA_ESTOQUE)}
                    </Radio>
                </div>
            }
        />
    );
}
