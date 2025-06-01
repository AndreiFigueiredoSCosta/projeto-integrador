import {useNavigate, useParams} from "react-router-dom";
import ReturnButton from "../../../../../../components/buttons/misc/ReturnButton";
import {DetailsInteraction} from "../../../../../../components/misc/DetailsInteraction";
import {StageBadge} from "../../../../../../components/misc/badges/default/StageBadge";
import ContinueButton from "../../../../../../components/buttons/misc/ContinueButton";
import EstagioEnum from "../../../../../../enums/EstagioEnum.ts";
import {ReactNode, useEffect, useState} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {useErrorHandling} from "../../../../../../hooks/useErrorHandling.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {Loading} from "../../../../../../components/misc/Loading";
import useToastManager from "../../../../../../hooks/useToastManager.ts";
import translateEstagioEnum from "../../../../../../utils/translators/translateEstagioEnum.ts";
import ProgressBar from "../../../../../../components/misc/ProgressBar";
import {ActionButton} from "../../../../../../components/buttons/action/ActionButton";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import CotacaoDadosResponseData from "../../../../../../models/cotacao/CotacaoDadosResponseData.ts";
import useDetails from "../../../../../../hooks/useDetails.ts";
import ConfirmModal from "../../../../../../components/modals/ConfirmModal";
import RequisicaoResponseDetailsData from "../../../../../../models/requisicao/RequisicaoResponseDetailsData.ts";
import DestinoEnum from "../../../../../../enums/DestinoEnum.ts";

type RequisicaoDetailsBarContentProps = {
    estagio?: EstagioEnum,
    onRevisarClick?: () => void,
    hasProgressbar?: boolean
}

export default function CotacaoDetailsBarContent({
                                                    estagio,
                                                    hasProgressbar = false
                                                    }: RequisicaoDetailsBarContentProps) {
    const navigate = useNavigate();
    const requisicaoId = useParams().requisicaoId as unknown as number;
    const [ estagioToNavigate, setEstagioToNavigate ] = useState<string>("");
    const { globalRefresh, data } = useDetails();
    const mappedData = data as RequisicaoResponseDetailsData;
    const { success } = useToastManager();
    const [ endpoint, setEndpoint ] = useState<string>("");
    const [ progressBarEndpoint, setProgressBarEndpoint ] = useState<string>("");
    const { isLoading, execute, isError, error, isSuccess } = useMutate(endpoint, {
        method: "PATCH"
    });
    const { isLoading: isProgressBarLoading, data: progressBarData, toggleRequest } = useFetch<CotacaoDadosResponseData>(progressBarEndpoint);
    const [ rightContent, setRightContent ] = useState<ReactNode>(null);
    const [ badgeColor, setBadgeColor ] = useState<'green' | 'yellow' | 'black' | 'red' | 'gray' | 'alt-green'>('gray');
    const buttons = (
        <>
            <DetailsInteraction
                onClick={() => {
                    setEstagioToNavigate("revisao");
                    setEndpoint(useEndpoint().cotacao().PATCH().alterarEstado(requisicaoId, EstagioEnum.REVISAO));
                    execute({});
                }}
                icon={"revisar"}
                variant={"alt-green"}
            >
                Revisar
            </DetailsInteraction>
        </>
    )

    const updateProgressBarEndpoint = (endpoint: string) => {
        return setProgressBarEndpoint(endpoint);
    }

    useEffect(() => {
        if (hasProgressbar) {
            toggleRequest();
        }
    }, [toggleRequest, hasProgressbar, globalRefresh, estagio]);

    useEffect(() => {
        switch (estagio) {
            case EstagioEnum.REVISAO:
                setBadgeColor("alt-green");
                setRightContent(
                    <ContinueButton
                        onClick={() => {
                            setEstagioToNavigate("cotacao");
                            setEndpoint(useEndpoint().cotacao().PATCH().alterarEstado(requisicaoId, EstagioEnum.COTACAO));
                            execute({});
                        }}
                        disabled={isLoading}
                    >
                        {
                            isLoading ? <Loading /> : "COTAR"
                        }
                    </ContinueButton>);
                break;
            case EstagioEnum.COTACAO:
                updateProgressBarEndpoint(useEndpoint().cotacao().GET().detalhes(requisicaoId).cotacao().dados);
                setBadgeColor("black");
                setRightContent(
                    <>
                        {hasProgressbar &&
                            <ProgressBar
                                percentage={(progressBarData as CotacaoDadosResponseData)?.porcentagemValidos}
                                isLoading={isProgressBarLoading}
                            />
                        }
                        {buttons}
                        <ContinueButton
                            onClick={() => {
                                setEndpoint(useEndpoint().cotacao().PATCH().alterarEstado(requisicaoId, EstagioEnum.APROVACAO));
                                execute({});
                                if (mappedData?.destinoEnum === DestinoEnum.VENDA) {
                                    navigate(`/cotacao`);
                                }
                                else {
                                    setEstagioToNavigate("aprovacao");
                                }
                            }}
                            disabled={isLoading}
                        >
                            {
                                isLoading ? <Loading /> : "ENVIAR PARA APROVAÇÃO"
                            }
                        </ContinueButton>
                    </>);
                break;
            case EstagioEnum.APROVACAO:
                updateProgressBarEndpoint(useEndpoint().cotacao().GET().detalhes(requisicaoId).aprovacao().dados);
                setBadgeColor("red");
                setRightContent(
                    <>
                        {hasProgressbar &&
                            <ProgressBar
                                percentage={(progressBarData as CotacaoDadosResponseData)?.porcentagemValidos}
                                isLoading={isProgressBarLoading}
                            />
                        }
                        {   !(mappedData?.destinoEnum === DestinoEnum.VENDA) &&
                            !mappedData?.aprovada &&
                            <>
                                <AprovarButton progressBarData={progressBarData as CotacaoDadosResponseData} />
                                <ReprovarButton progressBarData={progressBarData as CotacaoDadosResponseData} />
                            </>
                        }
                        <EnviarPedidoButton progressBarData={progressBarData as CotacaoDadosResponseData} />
                    </>);
                break;
            case EstagioEnum.CONCLUIDO:
                setBadgeColor("gray")
                break;
        }
    }, [estagio, isProgressBarLoading, progressBarData, hasProgressbar, globalRefresh]);

    useEffect(() => {
        if (isSuccess) {
            navigate(`/cotacao/detalhes/${estagioToNavigate}/${requisicaoId}`);
            success("Estágio avançado com sucesso.");
        }
    }, [isSuccess]);

    useErrorHandling(isError, error, "Erro ao realizar avanço o estágio da cotação.");

    return (
        <div className={"requisicao-details-bar-content"}>
            <div>
                <ReturnButton onClick={() => navigate("/cotacao")}> voltar </ReturnButton>
                <StageBadge variant={badgeColor}>
                    {translateEstagioEnum(estagio)}
                </StageBadge>
            </div>
            <div>
                {rightContent}
            </div>
        </div>
    );
}

function AprovarButton({progressBarData} : {progressBarData: CotacaoDadosResponseData}){
    const id = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().cotacao().PATCH().aprovacao(id).aprovar;
    const { success } = useToastManager();
    const { refreshDetails } = useDetails();
    const [ hide, setHide ] = useState(true);
    const { execute, isError, error, isSuccess, isLoading } = useMutate(endpoint, {
        method: "PATCH"
    })

    useEffect(() => {
        if (isSuccess){
            setHide(true);
            success("Cotação aprovada com sucesso.", null, true);
            refreshDetails();
        }
    }, [isSuccess, setHide, success]);

    useErrorHandling(isError, error, "Erro ao reprovar cotação.");

    return (
        <>
            <ConfirmModal
                hide={hide}
                setHide={setHide}
                title={"Confirmar aprovação"}
                onConfirm={() => {
                    execute({});
                }}
                isLoading={isLoading}
                confirmBtnText={"Aprovar"}
            >
                Tem certeza que deseja aprovar essa cotação?
            </ConfirmModal>
            <ActionButton
                variant={"details"}
                size={"small"}
                onClick={() => setHide(false)}
                hasLoading={isLoading}
                disabled={isLoading || progressBarData?.numeroValidos !== progressBarData?.numeroItens}
            >
                Aprovar
            </ActionButton>
        </>
    );
}

function ReprovarButton({progressBarData} : {progressBarData: CotacaoDadosResponseData}){
    const id = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().cotacao().PATCH().aprovacao(id).reprovar;
    const { success } = useToastManager();
    const [ hide, setHide ] = useState(true);
    const { execute, isError, error, isSuccess, isLoading } = useMutate(endpoint, {
        method: "PATCH"
    })

    useEffect(() => {
        if (isSuccess){
            setHide(true);
            success("Cotação reprovada com sucesso.", null, true);
        }
    }, [isSuccess, setHide, success]);

    useErrorHandling(isError, error, "Erro ao reprovar cotação.");

    return (
        <>
            <ConfirmModal
                hide={hide}
                setHide={setHide}
                title={"Confirmar reprovação"}
                onConfirm={() => {
                    execute({});
                }}
                isLoading={isLoading}
                confirmBtnText={"Reprovar"}
            >
                Tem certeza que deseja reprovar essa cotação?
            </ConfirmModal>
            <ActionButton
                variant={"delete"}
                size={"small"}
                onClick={() => setHide(false)}
                hasLoading={isLoading}
                disabled={isLoading || progressBarData?.numeroValidos !== progressBarData?.numeroItens}
            >
                Reprovar
            </ActionButton>
        </>
    );
}

function EnviarPedidoButton ({progressBarData} : {progressBarData: CotacaoDadosResponseData}){
    const { data } = useDetails();
    const requisicaoId = useParams().requisicaoId as unknown as number;
    const mappedData = data as RequisicaoResponseDetailsData;
    const endpoint = useEndpoint().cotacao().PATCH().alterarEstado(requisicaoId, mappedData?.destinoEnum === DestinoEnum.ESTOQUE ? EstagioEnum.PEDIDO : EstagioEnum.VALIDACAO)
    const navigate = useNavigate();
    const { isLoading, execute, isError, error, isSuccess } = useMutate(endpoint, {
        method: "PATCH"
    });
    const { success } = useToastManager();

    useEffect(() => {
        if (isSuccess){
            navigate(`/cotacao`);
            success("Pedido enviado com sucesso.", null, true);
        }
    }, [isSuccess, navigate, success]);

    useErrorHandling(isError, error, mappedData?.destinoEnum === DestinoEnum.ESTOQUE ? "Erro ao enviar pedido" : "Erro ao enviar para validação!");

    return (
        <ActionButton
            variant={"details"}
            onClick={() => {
                execute({});
            }}
            size={"small"}
            disabled={(progressBarData?.numeroValidos !== progressBarData?.numeroItens)
                || isLoading
            }
            hasLoading={isLoading}
        >
            {
                mappedData?.destinoEnum === DestinoEnum.ESTOQUE ? "Enviar pedido" : "validar"
            }
        </ActionButton>
    );
}
