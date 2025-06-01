// src/models/login/LoginRequest.ts
export interface LoginRequest extends Record<string | symbol, unknown> {
    email: string;
    password: string;
}
