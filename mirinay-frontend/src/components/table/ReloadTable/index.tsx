import {ActionButton} from "../../buttons/action/ActionButton";

interface ReloadTableProps {
    toggleRequest?: () => void
}

export default function ReloadTable({toggleRequest}: ReloadTableProps) {
    return (
        <div>
            <ActionButton variant={"cancel"} size={"large"} onClick={toggleRequest}>
                Recarregar
            </ActionButton>
        </div>
    );
}
