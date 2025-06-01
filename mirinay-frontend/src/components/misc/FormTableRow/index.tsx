import {Dispatch, ReactNode, SetStateAction} from "react";
import randomKey from "../../../utils/randomKey.ts";
import {Checkbox} from "../../form/misc/Checkbox";
import {P} from "../../text/P";

type types = {
    includes: boolean,
    setSelectedChecks: Dispatch<SetStateAction<number[]>>,
    isPresent?: boolean | undefined,
    children?: ReactNode,
    rowId: number
}

export default function FormTableRow({
                                                includes,
                                                setSelectedChecks,
                                                children,
                                                rowId,
                                                isPresent} : types) {
    return (
        <div key={randomKey()} style={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            padding: "5px",
            alignContent: "center",
        }}>
            <Checkbox
                size={"small"}
                checked={includes || isPresent}
                disabled={isPresent}
                onClick={() => {
                    let isPresent = false;
                    setSelectedChecks((checks) => {
                        checks.forEach((chk) => {
                            if (chk === rowId) {
                                isPresent = true;
                            }
                        });
                        if (!isPresent) {
                            return [...checks, rowId];
                        }
                        return checks.filter((chk) => chk !== rowId);
                    });
                }}
            />
            <P
                variant={"medium"}
                color={ isPresent ? "gray" : (includes ? "green" : "blank")}
                bold={includes || isPresent}
                uppercase={true}
            >
                {children}
            </P>
            {isPresent &&
                <P
                    variant={"small"}
                    color={"green"}
                    uppercase={true}
                    justify={"center"}
                    align={"middle"}
                >
                    (Já inserido)
                </P>
            }
        </div>
    );
}
