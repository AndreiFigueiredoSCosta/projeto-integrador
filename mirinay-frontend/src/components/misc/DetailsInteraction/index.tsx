import {ReactNode, useEffect, useState} from 'react';
import './style.css'
import { P } from '../../text/P';
import {Pencil} from "../../../assets/buttons/Pencil";
import {Cotar} from "../../../assets/buttons/Cotar";
import {Trash} from "../../../assets/buttons/Trash";
import {Clipboard} from "../../../assets/buttons/Clipboard";

interface Props {
   onClick: () => void;
   children?: ReactNode;
   variant?: 'green' | 'red' | 'yellow' | 'alt-green';
   icon?: 'cotacao' | 'editar' | 'excluir' | 'revisar';
}

/**
 *
 * @param onClick - função que será disparada ao clicar no componente
 * @param title - titulo que será exibido
 * @param icon - svg que será exposto
 * @param variant - cor do componente em hover
 */

export function DetailsInteraction({onClick, icon, children,variant}: Props) {

   const [svg, setSvg] = useState<ReactNode>(null);
    useEffect(() => {
        switch (icon) {
            case 'cotacao':
                setSvg(<Cotar size={"large"}/>)
                break;
            case 'editar':
                setSvg(<Pencil size={"large"}/>)
                break;
            case 'excluir':
                setSvg(<Trash size={"large"}/>)
                break;
            case 'revisar':
                setSvg(<Clipboard size={"large"}/>)
                break;
            default:
                console.log('Icone não encontrado');
                break;
        }
    }, [icon]);

   return (
       <div className={`container-details-interaction details-interaction-${variant}`}
            onClick={onClick}
       >
           <P bold={true} variant='large' color={`blank`}>{children}</P>
           {svg}
       </div>
   );

};
