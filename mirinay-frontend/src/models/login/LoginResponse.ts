export interface LoginResponse {
    token: string;
    expiresIn: number;
    user: {
        id: number;
        username: string;
        email: string;
        role: string;
        status: boolean;
    };
}
