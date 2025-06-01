import './style.css';
import {P} from "../../text/P";
import {Loading} from "../Loading";

interface LoadbarProps {
    percentage?: number,
    isLoading?: boolean
}

export default function ProgressBar({percentage = 0, isLoading}: LoadbarProps) {

    return (
        <div className={`progress-bar-container`}>
            { !isLoading ?
                <>
                    <span className={`progress-bar-progress`}
                          style={{width: `${percentage}%`}}
                    >
                        {
                            percentage >= 50 &&
                            <P
                                justify={"center"}
                                variant={"large"}
                                align={"middle"}
                                color={"white"}
                                bold={true}
                                uppercase={true}
                            >
                                {`${percentage}%`}
                            </P>
                        }
                        </span>
                        <span className={`progress-bar-loadpath`}
                              style={{width: `${100 - percentage}%`}}
                        >
                            {
                                percentage < 50 &&
                                <P
                                    justify={"center"}
                                    variant={"large"}
                                    align={"middle"}
                                    color={"white"}
                                    bold={true}
                                    uppercase={true}
                                >
                                    {`${percentage}%`}
                                </P>
                            }
                    </span>
                </>
                :
                <Loading />
            }
        </div>
    );
};
