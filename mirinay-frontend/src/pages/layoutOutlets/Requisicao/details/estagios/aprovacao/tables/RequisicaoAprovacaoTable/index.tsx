import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useEffect, useState} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import RequisicaoAprovacaoRow from "../../../../../components/rows/estagios/aprovacao/RequisicaoAprovacaoRow";
import RequisicaoAprovacaoHeader from "../../../../../components/headers/estagios/aprovacao/RequisicaoAprovacaoHeader";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";

import ConfirmModal from "../../../../../../../../components/modals/ConfirmModal";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import {useErrorHandling} from "../../../../../../../../hooks/useErrorHandling.ts";
import useToastManager from "../../../../../../../../hooks/useToastManager.ts";
import GetItensDTO from "../../../../../../../../models/requisicao/GetItensDTO.ts";


/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function RequisicaoAprovacaoTable() {
    const id = useParams().requisicaoId as unknown as number;
    const { globalRefresh } = useDetails();
    const { refresh } = useView();
    const endpoint = `${useEndpoint().requisicao().informacoes().subinformacoes(id).aprovacao}`;
    const [ mappedData, setMappedData ] = useState<GetItensDTO[]>([])
    const [ selected, setSelected ] = useState<GetItensDTO | undefined>(undefined);
    const { toggleRequest, data, isLoading, error, isError } = useFetch<GetItensDTO>(endpoint);
    const [ hideConfirmAprovarModal, setHideConfirmAprovarModal ] = useState(true);
    const [ hideConfirmReprovarModal, setHideConfirmReprovarModal ] = useState(true);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    useEffect(() => {
        if (data){
            const mapped = data as GetItensDTO[];
            const invalidos = mapped.filter((item) => item.estado === EstadoEnum.REMOVIDO || item.estado === EstadoEnum.DESCLASSIFICADO);
            const validos = mapped.filter((item) => item.estado !== EstadoEnum.REMOVIDO && item.estado !== EstadoEnum.DESCLASSIFICADO );

            setMappedData(validos.concat(invalidos));
        }
    }, [data]);

    const handleClick = (tipo: string, dados: GetItensDTO) => {
        setSelected(dados);
        switch (tipo) {
            case "aprovar":
                setHideConfirmAprovarModal(false);
                break;
            case "reprovar":
                setHideConfirmReprovarModal(false);
                break;
        }
    }
    // Função de renderização de conteúdo
    const contentFunction =
        (dados: GetItensDTO, index: number) => {
        return (
            <RequisicaoAprovacaoRow
                stripped={index % 2 == 1}
                data={dados}
                handleReprovar={() => handleClick("reprovar", dados)}
                handleAprovar={() => handleClick("aprovar", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<GetItensDTO>({
        isLoading,
        error,
        isError,
        data: mappedData as GetItensDTO[],
        errorMessage: "Erro ao carregar produtos",
        contentFunction: contentFunction,
        beforeContent: () => <RequisicaoAprovacaoHeader />
    });

    return (
        <>
            <AprovacaoModal
                hide={hideConfirmAprovarModal}
                setHide={setHideConfirmAprovarModal}
                item={selected}
            />
            <ReprovarModal
                hide={hideConfirmReprovarModal}
                setHide={setHideConfirmReprovarModal}
                item={selected}
            />
            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}

function AprovacaoModal ({
                             setHide,
                             hide,
                             item}
                             : {
                                hide: boolean,
                                setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                                item: GetItensDTO | undefined}
){
    const id = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().requisicao().operacoes(id).aprovacao(item?.itemId as number).aprovar;
    const { success } = useToastManager();
    const { refreshView } = useView();
    const { isLoading, error, isError, execute, isSuccess } = useMutate(endpoint, {
        method: "PATCH"
    });

    useEffect(() => {
        if (isSuccess){
            setHide(true);
            refreshView();
            success("Item aprovado com sucesso");
        }
    }, [isSuccess]);

    useErrorHandling(isError, error, "Erro ao aprovar item");

    return (
        <ConfirmModal
            hide={hide}
            setHide={setHide}
            title={"Aprovar item"}
            confirmBtnText={"Aprovar"}
            isLoading={isLoading}
            onConfirm={() => {
                execute({});
            }}
        >
            Deseja realmente aprovar o item?
        </ConfirmModal>
    )
}

function ReprovarModal ({
                             setHide,
                             hide,
                             item}
                             : {
                                hide: boolean,
                                setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                                item: GetItensDTO | undefined}
){
    const id = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().requisicao().operacoes(id).aprovacao(item?.itemId as number).reprovar;
    const { success } = useToastManager();
    const { refreshView } = useView();
    const { isLoading, error, isError, execute, isSuccess } = useMutate(endpoint, {
        method: "PATCH"
    });

    useEffect(() => {
        if (isSuccess){
            setHide(true);
            refreshView();
            success("Item reprovado com sucesso");
        }
    }, [isSuccess]);

    useErrorHandling(isError, error, "Erro ao reprovar o item");

    return (
        <ConfirmModal
            hide={hide}
            setHide={setHide}
            title={"Aprovar item"}
            confirmBtnText={"Aprovar"}
            isLoading={isLoading}
            onConfirm={() => {
                execute({});
            }}
        >
            Deseja realmente reprovar o item?
        </ConfirmModal>
    )
}
