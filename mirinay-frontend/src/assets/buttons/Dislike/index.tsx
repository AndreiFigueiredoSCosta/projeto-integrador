
export function Dislike({size = "small"}: {size?: 'small' | 'medium' | 'large'}) {
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
        <svg className={`dislike-icon`} width={`${height*1.1}`} height={height} viewBox={`0 0 ${height*1.1} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M23.3335 15H28.3335V0H23.3335M18.3335 0H7.0835C6.046 0 5.1585 0.625 4.7835 1.525L1.0085
                10.3375C0.895996 10.625 0.833496 10.925 0.833496 11.25V13.75C0.833496 14.413 1.09689 15.0489
                1.56573 15.5178C2.03457 15.9866 2.67045 16.25 3.3335 16.25H11.221L10.0335 21.9625C10.0085 22.0875
                9.996 22.2125 9.996 22.35C9.996 22.875 10.2085 23.3375 10.546 23.675L11.871 25L20.096 16.7625C20.5585
                16.3125 20.8335 15.6875 20.8335 15V2.5C20.8335 1.83696 20.5701 1.20107 20.1013 0.732233C19.6324
                0.263392 18.9965 0 18.3335 0Z"
                fill="currentColor"/>
        </svg>
    );
}
