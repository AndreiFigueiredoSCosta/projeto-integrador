import {useCallback, useState} from "react";
import useView from "../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../components/view/ViewContainer";
import FornecedorTable from "../../tables/FornecedorTable/index.tsx";
import FornecedorSubmitForm from "../../forms/FornecedorSubmitForm/index.tsx";
import FornecedorResponseData from "../../../../../../models/fornecedor/response/FornecedorResponseData.ts";

/**
 * Gerencia a comunicação entre os componentes da view de produto
 * @constructor
 */
export default function FornecedorView(){
    const [ fornecedor, setFornecedor ] = useState<FornecedorResponseData>();
    const context = useView();

    // handleInsert function
    const handleInsert = useCallback((info: FornecedorResponseData) => {
        if (info) {
            setTimeout(() => setFornecedor(info), 0);
        }

        // usa o setIsModalVisible para abrir o modal de forma que não atualize o estado da tabela de produto
        context.setIsSubmitContainerVisible((prevState) => {
            if (!prevState) {
                return true;
            }
            else{
                return prevState;
            }
        })
    }, [context]);

    return (
        <ViewContainer>
            <FornecedorTable handleInsert={handleInsert}/>
            <FornecedorSubmitForm fornecedor={fornecedor}/>
        </ViewContainer>
    );
}
