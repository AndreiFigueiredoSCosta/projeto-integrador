import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useEffect, useState} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import CotacaoAprovacaoResponseData
    from "../../../../../../../../models/cotacao/aprovacao/CotacaoAprovacaoResponseData.ts";
import CotacaoAprovacaoProdutoRow from "../../../../../components/rows/estagios/aprovacao/CotacaoAprovacaoProdutoRow";
import CotacaoAprovacaoItemResponseData
    from "../../../../../../../../models/cotacao/aprovacao/CotacaoAprovacaoItemResponseData.ts";
import ConfirmModal from "../../../../../../../../components/modals/ConfirmModal";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import {useErrorHandling} from "../../../../../../../../hooks/useErrorHandling.ts";
import useToastManager from "../../../../../../../../hooks/useToastManager.ts";
import ClassificacaoFornecedorRequestData
    from "../../../../../../../../models/misc/ClassificacaoFornecedorRequestData.ts";
import {TextArea} from "../../../../../../../../components/form/textarea/Textarea";
import DeleteModal from "../../../../../../../../components/modals/DeleteModal";
import CotacaoAprovacaoProdutoHeader
    from "../../../../../components/headers/estagios/aprovacao/CotacaoAprovacaoProdutoHeader";


/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function CotacaoAprovacaoTable() {
    const id = useParams().requisicaoId as unknown as number;
    const { globalRefresh } = useDetails();
    const { refresh } = useView();
    const endpoint = `${useEndpoint().cotacao().GET().detalhes(id).aprovacao().itens}`;
    const [ mappedData, setMappedData ] = useState<CotacaoAprovacaoResponseData[]>([])
    const [ selected, setSelected ] = useState<CotacaoAprovacaoResponseData | CotacaoAprovacaoItemResponseData | undefined>(undefined);
    const { toggleRequest, data, isLoading, error, isError } = useFetch<CotacaoAprovacaoResponseData>(endpoint);
    const [ hideConfirmAprovarItemModal, setHideConfirmAprovarItemModal ] = useState(true);
    const [ hideConfirmAprovarCotacaoModal, setHideConfirmAprovarCotacaoModal ] = useState(true);
    const [ hideConfirmReprovarModal, setHideConfirmReprovarModal ] = useState(true);
    const [ hideClassificarModal, setHideClassificarModal ] = useState(true);
    const [ hideDesclassificarModal, setHideDesclassificarModal ] = useState(true);
    const [ classificacao, setClassificacao ] = useState<-1 | 0 | 1>(0);
    const [ hideConfirmPreaprovarModal, setHideConfirmPreaprovarModal ] = useState(true);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    const handleClick = (tipo: string, dados: CotacaoAprovacaoResponseData | CotacaoAprovacaoItemResponseData, clf?: -1 | 0 | 1) => {
        setSelected(dados);
        switch (tipo) {
            case "classificar":
                setHideClassificarModal(false);
                updateClassificacao(clf as -1 | 0 | 1);
                break;
            case "desclassificar":
                setHideDesclassificarModal(false);
                break;
            case "aprovarCotacao":
                setHideConfirmAprovarCotacaoModal(false);
                break;
            case "preaprovar":
                setHideConfirmPreaprovarModal(false);
                break;
            case "aprovarItem":
                setHideConfirmAprovarItemModal(false);
                break;
            case "reprovar":
                setHideConfirmReprovarModal(false);
                break;
        }
    }
    const updateClassificacao = (clf: -1 | 0 | 1) =>{
        return setClassificacao(clf);
    }

    useEffect(() => {
        if (data){
            const mapped = data as CotacaoAprovacaoResponseData[];
            const invalidos = mapped.filter((item) => item.estado === EstadoEnum.REMOVIDO || item.estado === EstadoEnum.DESCLASSIFICADO);
            const validos = mapped.filter((item) => item.estado !== EstadoEnum.REMOVIDO && item.estado !== EstadoEnum.DESCLASSIFICADO );

            setMappedData(validos.concat(invalidos));
        }
    }, [data]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: CotacaoAprovacaoResponseData, index: number) => {
        return (
            <CotacaoAprovacaoProdutoRow
                stripped={index % 2 == 1}
                data={dados}
                handleAprovarItem={() => handleClick("aprovarItem", dados)}
                handleAprovarCotacao={(data) => handleClick("aprovarCotacao", data)}
                handlePreaprovar={() => handleClick("preaprovar", dados)}
                handleClassificar={(data, classificacao) => handleClick("classificar", data, classificacao)}
                handleDesclassificar={(data) => handleClick("desclassificar", data)}
                handleReprovar={() => handleClick("reprovar", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<CotacaoAprovacaoResponseData>({
        isLoading,
        error,
        isError,
        data: mappedData as CotacaoAprovacaoResponseData[],
        errorMessage: "Erro ao carregar produtos cotados",
        contentFunction,
        beforeContent: () => <CotacaoAprovacaoProdutoHeader />
    });

    return (
        <>
            <HandleAprovarItem
                hide={hideConfirmAprovarItemModal}
                setHide={setHideConfirmAprovarItemModal}
                selected={selected as CotacaoAprovacaoResponseData}
            />
            <HandleReprovar
                hide={hideConfirmReprovarModal}
                setHide={setHideConfirmReprovarModal}
                selected={selected as CotacaoAprovacaoResponseData}
                />
            <HandlePreaprovar
                hide={hideConfirmPreaprovarModal}
                setHide={setHideConfirmPreaprovarModal}
                selected={selected as CotacaoAprovacaoResponseData}
            />
            <HandleAprovarCotacao
                hide={hideConfirmAprovarCotacaoModal}
                setHide={setHideConfirmAprovarCotacaoModal}
                selected={selected as CotacaoAprovacaoItemResponseData}
            />
            <HandleClassificar
                hide={hideClassificarModal}
                setHide={setHideClassificarModal}
                classificacao={classificacao}
                selected={selected as CotacaoAprovacaoItemResponseData}
                />
            <HandleDesclassificar
                hide={hideDesclassificarModal}
                setHide={setHideDesclassificarModal}
                selected={selected as CotacaoAprovacaoItemResponseData}
                />
            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}

function HandleReprovar( {
                             hide,
                             setHide,
                             selected}
                             : {
                                hide: boolean,
                                setHide: (value: boolean | ((prevState: boolean) => boolean)) => void,
                                selected?: CotacaoAprovacaoResponseData}
    ) {
    const id = useParams().requisicaoId as unknown as number;
    const { success } = useToastManager();
    const endpoint = `${useEndpoint().cotacao().PATCH().aprovacao(id).item().alterar(selected?.itemId as number, EstadoEnum.DESAPROVADO)}`;
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint, {
        method: "PATCH",
    });
    const { refreshView } = useView();
    const { refreshDetails } = useDetails();

    useEffect(() => {
        if(isSuccess){
            refreshView();
            refreshDetails();
            setHide(true);
            success("Item reprovado com sucesso", null, true);
        }
    }, [isSuccess, refreshView, refreshDetails, setHide]);

    useErrorHandling(isError, error, "Erro ao reprovar item");

    return (
        <ConfirmModal
            hide={hide}
            setHide={setHide}
            title={"Deseja realmente reprovar esse item? "}
            onConfirm={() =>{
                execute({});
            }}
            confirmBtnText={"Reprovar"}
            isLoading={isLoading}
        >
            Tem certeza que deseja reprovar o item {selected?.nomeProduto}({selected?.referencia})?
        </ConfirmModal>
    );
}

function HandleAprovarItem ( {
                            hide,
                            setHide,
                            selected}
                            : {
                            hide: boolean,
                            setHide: (value: boolean | ((prevState: boolean) => boolean)) => void,
                            selected?: CotacaoAprovacaoResponseData
                            }
    ) {
    const id = useParams().requisicaoId as unknown as number;
    const { success } = useToastManager();
    const endpoint = `${useEndpoint().cotacao().PATCH().aprovacao(id).item().alterar(selected?.itemId as number, EstadoEnum.APROVADO)}`;
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint, {
        method: "PATCH",
    });
    const { refreshView } = useView();
    const { refreshDetails } = useDetails();

    useEffect(() => {
        if(isSuccess){
            refreshView();
            refreshDetails();
            setHide(true);
            success("Item aprovado com sucesso", null, true);
        }
    }, [isSuccess, refreshView, refreshDetails, setHide]);

    useErrorHandling(isError, error, "Erro ao aprovar item");

    return (
        <ConfirmModal
            hide={hide}
            setHide={setHide}
            title={"Deseja realmente aprovar esse item? "}
            onConfirm={() =>{
                execute({});
            }}
            confirmBtnText={"Aprovar"}
            isLoading={isLoading}
        >
            Tem certeza que deseja aprovar o item {selected?.nomeProduto}({selected?.referencia})?
        </ConfirmModal>
    );
}

function HandlePreaprovar( {
                               hide,
                               setHide,
                               selected}
                               : {
                                hide: boolean,
                                setHide: (value: boolean | ((prevState: boolean) => boolean)) => void,
                                selected?: CotacaoAprovacaoResponseData}
    ) {
    const id = useParams().requisicaoId as unknown as number;
    const { success } = useToastManager();
    const endpoint = `${useEndpoint().cotacao().PATCH().aprovacao(id).item().alterar(selected?.itemId as number, EstadoEnum.PREAPROVADO)}`;
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint, {
        method: "PATCH",
    });
    const { refreshView } = useView();
    const { refreshDetails } = useDetails();

    useEffect(() => {
        if(isSuccess){
            refreshView();
            refreshDetails();
            setHide(true);
            success("Item pré-aprovado com sucesso", null, true);
        }
    }, [isSuccess, refreshView, refreshDetails, setHide]);

    useErrorHandling(isError, error, "Erro ao pré-aprovar item");

    return (
        <ConfirmModal
            hide={hide}
            setHide={setHide}
            title={"Deseja realmente pré-aprovar esse item? "}
            onConfirm={() =>{
                execute({});
            }}
            confirmBtnText={"Pré-aprovar"}
            isLoading={isLoading}
        >
            Tem certeza que deseja pré-aprovar o item {selected?.nomeProduto} ({selected?.referencia})?
        </ConfirmModal>
    );
}

function HandleAprovarCotacao( {
                               hide,
                               setHide,
                               selected}
                               : {
                                hide: boolean,
                                setHide: (value: boolean | ((prevState: boolean) => boolean)) => void,
                                selected?: CotacaoAprovacaoItemResponseData}
    ) {
    const id = useParams().requisicaoId as unknown as number;
    const { success } = useToastManager();
    const endpoint = `${useEndpoint().cotacao().PATCH().aprovacao(id).cotacao().alterar(selected?.cotacaoId as number, EstadoEnum.APROVADO)}`;
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint, {
        method: "PATCH",
    });
    const { refreshView } = useView();
    const { refreshDetails } = useDetails();

    useEffect(() => {
        if(isSuccess){
            refreshView();
            refreshDetails();
            setHide(true);
            success("Cotação aprovada com sucesso", null, true);
        }
    }, [isSuccess, refreshView, refreshDetails, setHide]);

    useErrorHandling(isError, error, "Erro ao aprovar cotação");

    return (
        <ConfirmModal
            hide={hide}
            setHide={setHide}
            title={"Deseja realmente aprovar essa cotação? "}
            onConfirm={() =>{
                execute({});
            }}
            confirmBtnText={"Aprovar"}
            isLoading={isLoading}
        >
            Tem certeza que deseja aprovar a cotação com {selected?.nomeFornecedor}?
        </ConfirmModal>
    );
}

function HandleClassificar( {
                                hide,
                                setHide,
                                selected,
                                classificacao}
                                : {
                                hide: boolean,
                                setHide: (value: boolean | ((prevState: boolean) => boolean)) => void,
                                classificacao: -1 | 0 | 1,
                                selected?: CotacaoAprovacaoItemResponseData}
    ) {
    const id = useParams().requisicaoId as unknown as number;
    const [ motivo, setMotivo ] = useState("");
    const endpoint = `${useEndpoint().cotacao().PATCH().aprovacao(id).cotacao().classificar}`;
    const { isLoading, isError, error, execute, isSuccess } = useMutate<ClassificacaoFornecedorRequestData>(endpoint, {
        method: "PATCH",
    });
    const { refreshView } = useView();
    const { refreshDetails } = useDetails();

    useEffect(() => {
        if((classificacao !== -1 || selected?.classificacao == -1) && !hide){
            execute({
                cotacaoId: selected?.cotacaoId as number,
                valorClassificacao: classificacao,
                motivo: "",
                fornecedorId: selected?.fornecedorId as number
            } as ClassificacaoFornecedorRequestData);
        }
    }, [classificacao, execute, hide]);

    useEffect(() => {
        if(isSuccess){
            refreshView();
            refreshDetails();
            setHide(true);
        }
    }, [isSuccess, refreshView, refreshDetails, setHide]);

    useErrorHandling(isError, error, "Erro ao classificar cotação");

    if ((classificacao !== -1 || selected?.classificacao == -1) && !hide) {
        return (
            <>
            </>
        );
    }
    else if (!hide) {
        return (
            <ConfirmModal
                hide={hide}
                setHide={setHide}
                title={"Deseja realmente avaliar negativamente essa cotação? "}
                onConfirm={() => {
                    execute({
                        cotacaoId: selected?.cotacaoId as number,
                        valorClassificacao: classificacao,
                        motivo: motivo,
                        fornecedorId: selected?.fornecedorId as number
                    } as ClassificacaoFornecedorRequestData);
                }}
                confirmBtnText={"Avaliar"}
                isLoading={isLoading}
            >
                Tem certeza que deseja avaliar negativamente o fornecedor {selected?.nomeFornecedor} nessa cotação?
                <TextArea
                    label={"Motivo"}
                    name={"motivo"}
                    required={true}
                    disabled={isLoading}
                    maxLength={255}
                    minLength={3}
                    value={motivo}
                    onChange={(e) => setMotivo(e)}
                    />
            </ConfirmModal>
        );
    }
}
function HandleDesclassificar( {
                                   hide,
                                   setHide,
                                   selected}
                                   : {
                                    hide: boolean,
                                    setHide: (value: boolean | ((prevState: boolean) => boolean)) => void,
                                    selected?: CotacaoAprovacaoItemResponseData}
    ) {
    const id = useParams().requisicaoId as unknown as number;
    const { refreshView } = useView();
    const { refreshDetails } = useDetails();

    return (
        <DeleteModal
            hide={hide}
            setHide={setHide}
            request={useEndpoint().cotacao().DELETE().cotacao(id).desclassificar().cotacao(selected?.cotacaoId as number)}
            errorMessage={"Erro ao desclassificar cotação"}
            successMessage={"Cotação desclassificada com sucesso"}
            onDelete={() => {
                refreshDetails();
                refreshView();
                setHide(true);
            }}
            idToDelete={selected?.cotacaoId as number}
        >
            Deseseja realmente desclassificar a cotação do fornecedor {selected?.nomeFornecedor}?
        </DeleteModal>
    );
}
