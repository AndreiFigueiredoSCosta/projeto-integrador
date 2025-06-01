import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import {TableRow} from "../../../../../../../../components/table/TableRow";
import IconButton from "../../../../../../../../components/misc/IconButton";
import CotacaoRevisaoProdutoResponseData
    from "../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoResponseData.ts";
import {ActionButton} from "../../../../../../../../components/buttons/action/ActionButton";
import idConversor from "../../../../../../../../utils/idConversor.ts";
import {InfoHeader, InfoHeaderItem} from "../../../../../../../../components/InfoHeader";
import {ReactNode, useEffect, useState} from "react";
import CotacaoRevisaoProdutoSimilar from "./components/CotacaoRevisaoProdutoSimilar";
import CotacaoRevisaoProdutoClonagem from "./components/CotacaoRevisaoProdutoClonagem";
import DropdownProvider from "../../../../../../../../contexts/dropdown/DropdownProvider";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import {P} from "../../../../../../../../components/text/P";
import {AlertasBadge} from "../../../../../../../../components/misc/badges/request/AlertasBadge";
import {ProdutoUltimosPedidosBadge} from "../../../../../../../../components/misc/badges/request/ProdutoUltimosPedidosBadge";
import {ProdutoEstoqueBadge} from "../../../../../../../../components/misc/badges/request/ProdutoEstoqueBadge";
import {ProdutoEstatisticasBadge} from "../../../../../../../../components/misc/badges/request/ProdutoEstatisticasBadge";

interface ClonagemFornecedorRowProps {
    data: CotacaoRevisaoProdutoResponseData;
    stripped: boolean;
    handleSubmit: () => void;
    handleAlter: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoProdutoRow({
                                                     data,
                                                     stripped,
                                                     handleEdit,
                                                     handleSubmit,
                                                     handleAlter,
                                                     handleDelete }
                                                     : ClonagemFornecedorRowProps){
    const [ table, setTable ] = useState<ReactNode>();
    const [ currentItem, setCurrentItem ] = useState<string>();
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

    useEffect(() => {
        if (data.encontrado && isDropdownOpen) {
            setTable(
                <CotacaoRevisaoProdutoSimilar
                    itemId={data.itemId} />
            )
        }
        setCurrentItem("similares");
    }, [setTable, data, isDropdownOpen, setCurrentItem]); //TODO: BUG ao fechar o dropdown em clonagem e abrir novamente

    const dropdownContent = (
        <DropdownProvider>
            <InfoHeader items={[
                {
                    text: "Similares",
                    onChange: () => {
                        setCurrentItem("similares");
                        setTable(
                            <CotacaoRevisaoProdutoSimilar
                                itemId={data.itemId} />
                        )
                    },
                    selected: currentItem === "similares"
                },
                {
                    text: "Clonagem",
                    onChange: () => {
                        setCurrentItem("clonagem");
                        setTable(
                            <CotacaoRevisaoProdutoClonagem
                                itemId={data.itemId} similarId={data.similarId} />
                        )
                    },
                    selected: currentItem === "clonagem"
                }
            ] as InfoHeaderItem[]} />
            {table}
        </DropdownProvider>
    )

    return (
        <TableRow
            stripped={stripped}
            rejected={!data.encontrado}
            removed={data.estado === EstadoEnum.REMOVIDO || data.estado === EstadoEnum.DESCLASSIFICADO}
            noClickDropdown={!data.encontrado}
            dropdown={true}
            content={dropdownContent}
            onClick={() => {
                return setIsDropdownOpen(!isDropdownOpen);
            }}
        >
            <RowPiece size={3}>
                {
                    data.encontrado ?
                        <>
                            {idConversor(data.produtoId)} - {data.nomeProduto}
                        </>
                        :
                        <>
                            {data.referencia} - (SEM CADASTRO)
                        </>
                }
            </RowPiece>
            <RowPiece size={2} textSize={"small"}>
                {
                    data.encontrado ?
                        <>
                            {data.grupo}/{data.subgrupo}
                        </>
                        :
                        "-"

                }
            </RowPiece>
            <RowPiece size={2} textSize={"large"}>
                {data.quantidade}
            </RowPiece>
            {
                data.encontrado && data.estado != EstadoEnum.REMOVIDO && data.estado != EstadoEnum.DESCLASSIFICADO &&
                <RowPiece size={4} style={{display: "flex", gap: "5px"}}>
                    <AlertasBadge id={data.itemId} />
                    <ProdutoUltimosPedidosBadge produtoId={data.produtoId} />
                    <ProdutoEstoqueBadge produtoId={data.produtoId} />
                    <ProdutoEstatisticasBadge produtoId={data.produtoId} />
                </RowPiece>
            }
            <RowPiece size={data.encontrado && data.estado != EstadoEnum.REMOVIDO && data.estado != EstadoEnum.DESCLASSIFICADO ? 1 : 5}>
                {
                    data.estado === EstadoEnum.REMOVIDO ?
                        <P
                            bold={true}
                            variant={"large"}
                            uppercase={true}
                            color={"red"}
                            align={"middle"}
                            justify={"center"}
                        >
                            REMOVIDO
                        </P>
                        :
                        data.estado === EstadoEnum.DESCLASSIFICADO ?
                            <P
                                bold={true}
                                variant={"large"}
                                uppercase={true}
                                color={"red"}
                                align={"middle"}
                                justify={"center"}
                            >
                                DESCLASSIFICADO
                            </P>
                            :
                        <div style={{
                            display: "flex",
                            justifyContent: "end",
                            gap: "10px"
                        }}>
                            {
                                data.encontrado ?
                                    <IconButton
                                        size={"small"}
                                        variant={"edit"}
                                        onClick={handleEdit}
                                    />
                                    :
                                    <>
                                        <ActionButton
                                            variant={"submit"}
                                            onClick={handleSubmit}
                                            size={"small"}
                                        >
                                            cadastrar
                                        </ActionButton>

                                        <ActionButton
                                            variant={"submit"}
                                            size={"small"}
                                            onClick={handleAlter}
                                        >
                                            alterar
                                        </ActionButton>
                                    </>
                            }
                            <IconButton size={"small"} variant={"delete"} onClick={handleDelete}/>
                        </div>
                }
            </RowPiece>
        </TableRow>
    );
}
