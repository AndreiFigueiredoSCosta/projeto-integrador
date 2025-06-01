import React, {useRef, useState, useLayoutEffect} from 'react';
import './style.css';

export const Loading: React.FC = () => {
    const loadingContainer = useRef<HTMLDivElement>(null);
    const [loadingWH, setLoadingWH] = useState<number>(20);
    const [ loadingBW, setLoadingBW ] = useState<number>(3);


    useLayoutEffect(() => {
        console.log('Loading useEffect : ', loadingContainer.current?.clientWidth, loadingContainer.current?.clientHeight);

        setLoadingWH(() =>{
            const smallerSide = Math.min(
                loadingContainer.current?.clientHeight || 20,
                loadingContainer.current?.clientWidth || 20
            );

            setLoadingBW(() => {
                if (smallerSide < 20) {
                    return 3;
                }
                else{
                    return smallerSide*0.15;
                }
            });

            if (smallerSide < 20) {
                return 20;
            }

            else{
                return smallerSide;
            }
        })
    }, []);


    return (
        <div className="loading-container" ref={loadingContainer}>
            <div className="loading" style={{ height: loadingWH, width: loadingWH, borderWidth: loadingBW }}></div>
        </div>
    );
};
