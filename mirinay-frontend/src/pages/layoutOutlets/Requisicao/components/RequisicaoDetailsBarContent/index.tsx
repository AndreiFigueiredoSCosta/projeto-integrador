import {useNavigate, useParams} from "react-router-dom";
import ReturnButton from "../../../../../components/buttons/misc/ReturnButton";
import {DetailsInteraction} from "../../../../../components/misc/DetailsInteraction";
import "./style.css";
import {StageBadge} from "../../../../../components/misc/badges/default/StageBadge";
import ContinueButton from "../../../../../components/buttons/misc/ContinueButton";
import EstagioEnum from "../../../../../enums/EstagioEnum.ts";
import {ReactNode, useEffect, useState} from "react";
import {useMutate} from "../../../../../hooks/useMutate.ts";
import {useErrorHandling} from "../../../../../hooks/useErrorHandling.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {Loading} from "../../../../../components/misc/Loading";
import useToastManager from "../../../../../hooks/useToastManager.ts";
import translateEstagioEnum from "../../../../../utils/translators/translateEstagioEnum.ts";

type RequisicaoDetailsBarContentProps = {
    onDeleteClick?: () => void,
    onEditClick?: () => void,
    estagio?: EstagioEnum
}

export default function RequisicaoDetailsBarContent({
                                                        onDeleteClick = () => {},
                                                        onEditClick = () => {},
                                                        estagio
                                                    }: RequisicaoDetailsBarContentProps) {
    const navigate = useNavigate();
    const requisicaoId = useParams().requisicaoId as unknown as number;
    const [ estagioToNavigate, setEstagioToNavigate ] = useState<string>("");
    const { success } = useToastManager();
    const [ endpoint, setEndpoint ] = useState<string>("");
    const { isLoading, execute, isError, error, isSuccess } = useMutate(endpoint, {
        method: "PUT"
    });
    const [ rightContent, setRightContent ] = useState<ReactNode>(null);
    const [ badgeColor, setBadgeColor ] = useState<'green' | 'yellow' | 'black' | 'red' | 'gray' | 'alt-green'>('gray');
    const buttons = (
        <>
            <DetailsInteraction onClick={onEditClick} icon={"editar"}
                                variant={"alt-green"}>Editar</DetailsInteraction>
            <DetailsInteraction onClick={onDeleteClick} icon={"excluir"}
                                variant={"red"}>Excluir</DetailsInteraction>
        </>
    )



    useEffect(() => {
        switch (estagio) {
            case EstagioEnum.CONSTRUCAO:
                setBadgeColor("alt-green");
                setRightContent(
                    <>
                        {buttons}
                        <ContinueButton
                            onClick={() => {
                                setEstagioToNavigate("cotacao");
                                setEndpoint(useEndpoint().requisicao().operacoes(requisicaoId).geral().avancar(EstagioEnum.REVISAO));
                                execute({});
                            }}
                            disabled={isLoading}
                        >
                            {
                                isLoading ? <Loading /> : "COTAR"
                            }
                        </ContinueButton>
                    </>
                );
                break;
            case EstagioEnum.COTACAO:
                setBadgeColor("black");
                setRightContent(null);
                break;
            case EstagioEnum.REVISAO:
                setBadgeColor("black");
                setRightContent(null);
                break;
            case EstagioEnum.APROVACAO:
                setBadgeColor("black");
                setRightContent(null);
                break;
            case EstagioEnum.VALIDACAO:
                setRightContent(
                    <ContinueButton
                        onClick={() => {
                            setEstagioToNavigate("pedido");
                            setEndpoint(useEndpoint().requisicao().operacoes(requisicaoId).geral().avancar(EstagioEnum.PEDIDO));
                            execute({});
                        }}
                        disabled={isLoading}
                    >
                        {
                            isLoading ? <Loading /> : "PEDIR"
                        }
                    </ContinueButton>
                )
                setBadgeColor("red");
                break;
            case EstagioEnum.PEDIDO:
                setBadgeColor("green");
                setRightContent(null);
                break;
            case EstagioEnum.CONCLUIDO:
                setBadgeColor("gray");
                break;
            default:
                break
        }
    }, [estagio]);

    useEffect(() => {
        if (isSuccess) {
            navigate(`/requisicao/detalhes/${estagioToNavigate}/${requisicaoId}`);
            success("Estágio avançado com sucesso.");
        }
    }, [isSuccess]);

    useErrorHandling(isError, error, "Erro ao realizar avançar o estágio da requisição.");

    return (
        <div className={"requisicao-details-bar-content"}>
            <div>
                <ReturnButton onClick={() => navigate("/requisicao")}> voltar </ReturnButton>
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
