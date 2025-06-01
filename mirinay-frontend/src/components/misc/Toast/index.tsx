import './style.css';
import { CloseButton } from '../../buttons/misc/CloseButton';
import React from 'react';
import {P} from "../../text/P";
import useToast from "../../../hooks/useToast.ts";

/**
 * Aviso que vai aparecer na pagina, tendo variações, succes, warning e danger
 *
 * @param variant - define a variant ente succes, warning e danger
 * @param title - titulo do aviso
 * @param children - conteudo do anuncio
 * @param index - key do aviso na lista do ToastProvider
 */

export function Toast({index,
                          variant,
                          title,
                          children}
                          :
                          {index: number,
                              variant: 'success' | 'warning' | 'danger',
                              title?: React.ReactNode,
                              children? : React.ReactNode}){

  const color = variant === 'success' ? 'green' : variant === 'warning' ? 'yellow' : 'red';
  const closeToast = useToast().closeToast;

  const handleClick = () => {
        closeToast(index);
  }

  return (
    <div className={`toast toast-${variant}`}>

      <div className="header-toast">
          <P children={title} color={color} bold={true} uppercase={true}/>

          <CloseButton onClick={handleClick} variant={"medium"}/>
      </div>

      <div className="content-toast">
        <P children={children} color={color} variant={"small"}/>
       </div>
    </div>
  )

}




