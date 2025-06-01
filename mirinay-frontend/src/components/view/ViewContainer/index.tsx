import React from "react";

import './style.css';
import useView from "../../../hooks/useView.ts";

export default function ViewContainer({children} : {children?: React.ReactNode}){
    const context = useView();

    return (
        <div className={`view ${context.isSubmitContainerVisible && 'view-gap'}`}>
            {children}
        </div>
    );
}
