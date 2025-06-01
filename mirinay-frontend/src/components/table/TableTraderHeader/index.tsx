import './style.css'
import { P } from '../../text/P';
import { useEffect } from 'react';


/**
 * 
 * @param names -
 * @param stage - Define qual o estagio inicial do componente(caso seja nulo o valor sera definido para o primeiro item do array names)
 * 
 */

export function TableTraderHeader ({stage, value, setCurrentStage} : {stage:string, value:string[], setCurrentStage: (value: string) => void}) {
    
    useEffect(() => {
        if (!stage && value.length > 0) {
            setCurrentStage(value[0]);
        }
    }, [stage, value, setCurrentStage]);

    return (


            <div className='TableTraderHeader'>
              
                {value.map((value) => (

                    <div key={value} className={`StageItem ${value == stage? 'active' : 'inactive'}`} onClick={() => setCurrentStage(value)}>
                        <P bold={true} color={`${value == stage? 'green' : ''}`}>{value}</P>
                        </div>
                ))}

            </div>

        
    );
}