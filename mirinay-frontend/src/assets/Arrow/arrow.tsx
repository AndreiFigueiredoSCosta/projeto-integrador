type ArrowIconProps = {
    clicked?: boolean;
};

export function ArrowIcon({ clicked = false }: ArrowIconProps) {
    return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            {clicked ? (
                <path d="M24.9236 15.258L10.0383 24.1868V5.55517L24.9236 15.258Z" fill="#ACABAC" />
            ) : (
                <path d="M14.742 24.9236L5.81318 10.0383H24.4448L14.742 24.9236Z" fill="#00A859" />
            )}
        </svg>
    );
}
