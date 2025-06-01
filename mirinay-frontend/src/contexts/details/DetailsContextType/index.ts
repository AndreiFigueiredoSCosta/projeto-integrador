import React from "react";

export default interface DetailsContextType {
    data: unknown;
    setData:  React.Dispatch<unknown>;
    isLoading: boolean;
    setIsLoading:  React.Dispatch<React.SetStateAction<boolean>>;
    refreshDetails: () => void;
    globalRefresh: boolean;
}
