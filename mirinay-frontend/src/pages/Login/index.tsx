import './style.css';
import Input from "../../components/form/input/Input";
import icon from "../../assets/icon.svg";
import { useAuth } from "../../hooks/useAuth.ts";
import {FormEvent, useState, useEffect} from "react";
import {ActionButton} from "../../components/buttons/action/ActionButton";
import {LoginRequest} from "../../models/login/LoginRequest.ts";
import {LoginResponse} from "../../models/login/LoginResponse.ts";
import {Loading} from "../../components/misc/Loading";
import {useMutate} from "../../hooks/useMutate.ts";
import ToastContainer from "../../components/misc/ToastContainer";
import {useErrorHandling} from "../../hooks/useErrorHandling.ts";

export default function Login() {
    const login = useAuth().login;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { execute, data, abort, isLoading, error, isError} = useMutate<LoginResponse>("/auth/login");
    // const { execute: executeRegister } = useMutate<RegisterUser>("/auth/register"); // Para testes

    useEffect(() => {
        return () => {
            if (isLoading){
                abort();
            }
        }
    }, [abort, isLoading]);

    useEffect(() => {
        if (data) {
            login(data as LoginResponse);
        }
    }, [data, login]);

    useErrorHandling(isError, error, "Erro ao fazer login");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const RequestData = {email, password} as LoginRequest;

        execute(RequestData);
    };

    return (
        <>
            <ToastContainer/>
            <div id="login-body">
                <div className="login-container">
                    <img src={icon} alt={"Ícone Mirinay"} />
                    <div className="login-title">
                        <h1>Seja bem-vindo</h1>
                        <h2>Faça login para prosseguir</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <Input
                                type={"email"}
                                label={"Email"}
                                name={"email"}
                                required={true}
                                autoComplete={true}
                                value={email}
                                onChange={(e) => setEmail(e)}
                                minLength={3}
                            />
                            <Input
                                type={"password"}
                                label={"Senha"}
                                name={"password"}
                                required={true}
                                autoComplete={true}
                                value={password}
                                onChange={(e) => setPassword(e)}
                                minLength={3}
                            />
                        </div>

                        <ActionButton type={"submit"} variant={"submit"} size={"small"} disabled={isLoading}>
                            { isLoading ? <Loading/> : 'Entrar' }
                        </ActionButton>
                    </form>
                </div>
            </div>
            {/*<ActionButton onClick={() => {*/}
            {/*    executeRegister({*/}
            {/*        email: "fernando@gmail.com",*/}
            {/*        password: "123456",*/}
            {/*        name: "Fernando",*/}
            {/*        telefone: "123456789",*/}
            {/*        gender: "M"*/}
            {/*    } as RegisterUser);*/}
            {/*}} variant={"submit"}> Registrar Novo</ActionButton>*/}
        </>
    );
}
//
// interface RegisterUser extends Record<string | symbol, unknown>{
//     email: string;
//     password: string;
//     name: string;
//     telefone: string;
//     gender: string;
// }
