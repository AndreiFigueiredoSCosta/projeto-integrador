import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import {TableRow} from "../../../../../../../../components/table/TableRow";

import {ActionButton} from "../../../../../../../../components/buttons/action/ActionButton";
import idConversor from "../../../../../../../../utils/idConversor.ts";
import {ReactNode, useEffect, useState} from "react";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import {P} from "../../../../../../../../components/text/P";
import DataTableColumn from "../../../../../../../../components/dataTable/DataTableColumn";
import DataTableRow from "../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../components/dataTable/DataTableCell";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import translateEstadoEnum from "../../../../../../../../utils/translators/translateEstadoEnum.ts";
import CotacaoCotacaoCotacaoHeader from "./components/CotacaoAprovacaoCotacaoHeader";
import useView from "../../../../../../../../hooks/useView.ts";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import CotacaoAprovacaoItemResponseData
    from "../../../../../../../../models/cotacao/aprovacao/CotacaoAprovacaoItemResponseData.ts";
import CotacaoAprovacaoResponseData
    from "../../../../../../../../models/cotacao/aprovacao/CotacaoAprovacaoResponseData.ts";
import CotacaoAprovacaoCotacaoRow from "./components/CotacaoAprovacaoCotacaoRow";
import DestinoEnum from "../../../../../../../../enums/DestinoEnum.ts";
import {AlertasBadge} from "../../../../../../../../components/misc/badges/request/AlertasBadge";

interface ClonagemFornecedorRowProps {
    data: CotacaoAprovacaoResponseData,
    stripped: boolean,
    handleReprovar: () => void,
    handlePreaprovar: () => void,
    handleAprovarItem: () => void,
    handleClassificar: (data: CotacaoAprovacaoItemResponseData, classificacao: -1 | 0 | 1) => void,
    handleDesclassificar: (data: CotacaoAprovacaoItemResponseData) => void,
    handleAprovarCotacao: (data: CotacaoAprovacaoItemResponseData) => void
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoAprovacaoProdutoRow({
                                                       data,
                                                       stripped,
                                                       handleClassificar,
                                                       handleDesclassificar,
                                                       handleReprovar,
                                                       handlePreaprovar,
                                                       handleAprovarItem,
                                                       handleAprovarCotacao
                                                   }
                                                       : ClonagemFornecedorRowProps) {
    const id = useParams().requisicaoId as unknown as number;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {refresh} = useView();
    const {globalRefresh} = useDetails();
    const invalido = data.estado === EstadoEnum.DESCLASSIFICADO || data.estado === EstadoEnum.REMOVIDO;
    const endpoint = useEndpoint().cotacao().GET().detalhes(id).aprovacao().cotacoes(data.itemId);
    const [ rowActions, setRowActions ] = useState<ReactNode>(null);
    const {
        data: dropdownData,
        isLoading,
        isError,
        error,
        toggleRequest
    } = useFetch<CotacaoAprovacaoItemResponseData>(endpoint);

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [isDropdownOpen, toggleRequest, refresh, globalRefresh]);

    const beforeContent = () => {
        return (
            <>
                <div style={{
                    backgroundColor: "var(--branco)",
                }}>
                    <DataTableColumn size={1}>
                        <DataTableRow>
                            <DataTableCell
                                contentTextSize={"small"}
                                title={"Observação"}
                                type={"text"}
                            >
                                {data.observacao}
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableColumn>
                </div>
                <CotacaoCotacaoCotacaoHeader/>
            </>
        )
    }

    const contentFunction = (dados: CotacaoAprovacaoItemResponseData, index: number) => {
        return (
            <CotacaoAprovacaoCotacaoRow
                data={dados}
                quantidadeTotal={data.quantidade}
                handlePreaprovar={() => handleAprovarCotacao(dados)}
                handleClassificar={(classificacao) => handleClassificar(dados, classificacao)}
                handleDesclassificar={() => handleDesclassificar(dados)}
                stripped={index % 2 != 0}
            />
        );
    }

    const dropdownContent = useTableContent<CotacaoAprovacaoItemResponseData>(
        {
            data: dropdownData as CotacaoAprovacaoItemResponseData[],
            isLoading,
            isError,
            error,
            beforeContent,
            contentFunction,
            errorMessage: "Erro ao carregar cotações",
            limited: false
        }
    )

    useEffect(() => {
        let aproveBtns: ReactNode = null;
        let reproveBtns: ReactNode = null;

        switch (data.estado) {
            case EstadoEnum.PREAPROVADO:
                if (data.destino === DestinoEnum.VENDA) {
                    aproveBtns = (
                        <P
                            bold={true}
                            variant={"large"}
                            color={"green"}
                            justify={"center"}
                            align={"middle"}
                            uppercase={true}
                        >
                            PRÉ-APROVADO
                        </P>
                    );
                }
                else {
                    aproveBtns = (
                        <ActionButton
                            variant={"submit"}
                            size={"small"}
                            onClick={handleAprovarItem}
                            style={{
                                width: "fit-content"
                            }}
                        >
                            APROVAR
                        </ActionButton>
                    );
                }
                break;
            case EstadoEnum.APROVADO:
                aproveBtns = (
                    <P
                        bold={true}
                        variant={"large"}
                        color={"green"}
                        justify={"center"}
                        align={"middle"}
                        uppercase={true}
                    >
                        APROVADO
                    </P>
                );
                break;
            default:
                aproveBtns = (
                    <ActionButton
                        variant={"submit"}
                        size={"small"}
                        onClick={handlePreaprovar}
                        style={{
                            width: "fit-content"
                        }}
                    >
                        PRÉ-APROVAR
                    </ActionButton>
                );
                break;
        }

        // Lida com o botão de reprovação
        switch (data.estado) {
            case EstadoEnum.DESAPROVADO:
                reproveBtns = (
                    <P
                        bold={true}
                        variant={"large"}
                        color={"red"}
                        justify={"center"}
                        align={"middle"}
                        uppercase={true}
                    >
                        REPROVADO
                    </P>
                );
                break;
            default:
                reproveBtns = (
                    <ActionButton
                        variant={"delete"}
                        size={"small"}
                        onClick={handleReprovar}
                        style={{
                            width: "fit-content"
                        }}
                    >
                        REPROVAR
                    </ActionButton>
                );
                break;
        }

        setRowActions(
            <>
                {aproveBtns}
                {reproveBtns}
            </>
        );
    }, [data]);

    return (
        <TableRow
            stripped={stripped}
            rejected={data.estado === EstadoEnum.DESAPROVADO}
            selected={data.estado === EstadoEnum.PREAPROVADO}
            removed={invalido}
            approved={data.estado === EstadoEnum.APROVADO}
            noClickDropdown={invalido}
            dropdown={true}
            content={dropdownContent}
            onClick={() => {
                return setIsDropdownOpen(!isDropdownOpen);
            }}
        >
            <RowPiece size={3}>
                {
                    data.produtoId ?
                        <>{idConversor(data.produtoId) + " - " + data.nomeProduto}</>
                        :
                        <>PRODUTO NÃO ENCONTRADO</>

                }
            </RowPiece>
            <RowPiece size={2} textSize={!data.marca ? "medium" : "small"}>
                {data.marca && data.marca} ({data.referencia})
            </RowPiece>
            {
                !invalido &&
                <RowPiece size={3}>
                    <AlertasBadge id={id} type={"item"} />
                </RowPiece>
            }
            <RowPiece size={invalido ? 7 : 4}>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center"
                    }}
                >
                    {
                        invalido ?
                            <P bold={true} variant={"large"} color={"red"}>
                                {translateEstadoEnum(data.estado)}
                            </P>
                            :
                            rowActions
                    }

                </div>
            </RowPiece>
        </TableRow>
    );
}
