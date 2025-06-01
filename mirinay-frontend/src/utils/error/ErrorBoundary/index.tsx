import { Component, ErrorInfo, ReactNode } from 'react';
import useToastManager from "../../../hooks/useToastManager.ts";

const logError = (error: Error, errorInfo: ErrorInfo) => {
    console.group('Error Boundary');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.groupEnd();
};

interface Props {
    children: ReactNode;
    toastManager: ReturnType<typeof useToastManager>;
}

interface State {
    hasError: boolean;
}

class ErrorBoundaryClass extends Component<Props, State> {
    state: State = {
        hasError: false,
    };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      logError(error, errorInfo)

      this.props.toastManager.danger(`${error.name}`, error.message);

      this.setState({ hasError: false });
    }

    render() {
        return this.props.children;
    }
}

const ErrorBoundary = (props: { children: ReactNode }) => {
  const toastManager = useToastManager();
  return <ErrorBoundaryClass toastManager={toastManager}>{props.children}</ErrorBoundaryClass>;
};

export default ErrorBoundary;
