import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import {TextArea} from "../../../../../../components/form/textarea/Textarea";
import useView from "../../../../../../hooks/useView.ts";
import {SelectOption} from "../../../../../../types/SelectOption.ts";
import PrioridadeEnum from "../../../../../../enums/PrioridadeEnum.ts";
import {Select} from "../../../../../../components/form/select/Select";
import Input from "../../../../../../components/form/input/Input";

interface UnificacaoSubmitFormProps {
    selectedItens?: number[],
    isLoading?: boolean
}

/**
 * Formulário de submissão de Unificação
 * @constructor
 */
export default function UnificacaoSubmitForm({selectedItens, isLoading}: UnificacaoSubmitFormProps) {
    const {isSubmitContainerVisible} = useView();


    const options: SelectOption[] = [
        {
            value: PrioridadeEnum.COMPRAR,
            label: PrioridadeEnum.COMPRAR
        },
        {
            value: PrioridadeEnum.COTAR,
            label: PrioridadeEnum.COTAR
        }
    ];

    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         isLoading={isLoading}
                         isButtonDisabled={selectedItens?.length === 0}
                         hasDefaultForm={false}
                         btnText={"Unificar"}
        >
            {
                isSubmitContainerVisible &&
                <>
                    <Input type={"text"} label={"Nome"} name={"nome"} required={true} minLength={3} maxLength={255}/>
                    <Select label={"Prioridade"} options={options} name={"prioridade"} required={true}/>
                    <TextArea label={"Observação"} name={"observacao"} required={false}/>
                </>
            }
            </SubmitContainer>
    );
}
