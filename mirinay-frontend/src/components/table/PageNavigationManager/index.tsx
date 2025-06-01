import useView from "../../../hooks/useView.ts";
import {NavButton} from "../../buttons/misc/NavButton";
import ViewProperties from "../../../models/view/ViewProperties.ts";
import {SearchViewProperties} from "../../../contexts/search/SearchProvider";

export default function PageNavigationManager ({currentView} : {currentView: ViewProperties | SearchViewProperties}){
    const { refreshView, canNavLeft, canNavRight, viewItens, maxItens } = useView();

    const handleNavigation = (type: "left" | "right") =>{
        switch (type) {
            case "left":
                if (canNavLeft) {
                    currentView.page = currentView.page - 1;
                    currentView.showedItens = currentView.showedItens - maxItens;
                    refreshView();
                }

                break;
            case "right":
                if (canNavRight) {
                    currentView.page = currentView.page + 1;
                    currentView.showedItens = currentView.showedItens + viewItens;
                    refreshView();
                }
        }
    }

    return (
        <>
            <NavButton variant={"left"} onClick={() => handleNavigation("left")} disabled={!canNavLeft}/>
            <NavButton variant={"right"} onClick={() => handleNavigation("right")} disabled={!canNavRight}/>
        </>
    );
}
