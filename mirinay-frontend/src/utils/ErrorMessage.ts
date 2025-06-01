const ErrorMessage = (title: string, message: string) : Error => {
    const error = new Error(message);
    error.name = title;
    return error;
}

export default ErrorMessage;
