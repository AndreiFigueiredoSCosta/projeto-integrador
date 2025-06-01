
export function Like({size = "small"}: {size?: 'small' | 'medium' | 'large'}) {
    let height;
    switch (size) {
        case "small":
            height = 25;
            break;
        case "medium":
            height = 27;
            break;
        case "large":
            height = 30;
            break;
        default:
            height = 25;
    }

    return (
        <svg className={`like-icon`} width={`${height*1.1}`} height={height} viewBox={`0 0 ${height*1.1} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M28.3335 11.25C28.3335 10.587 28.0701 9.95107 27.6013 9.48223C27.1324 9.01339 26.4965 8.75 25.8335
                8.75H17.9335L19.1335 3.0375C19.1585 2.9125 19.171 2.775 19.171 2.6375C19.171 2.125 18.9585 1.65
                18.621 1.3125L17.296 0L9.071 8.225C8.6085 8.6875 8.3335 9.3125 8.3335 10V22.5C8.3335 23.163 8.59689
                23.7989 9.06573 24.2678C9.53457 24.7366 10.1705 25 10.8335 25H22.0835C23.121 25 24.0085 24.375 24.3835
                23.475L28.1585 14.6625C28.271 14.375 28.3335 14.075 28.3335 13.75V11.25ZM0.833496 25H5.8335V10H0.833496V25Z"
                fill="currentColor"/>
        </svg>

    );
}
