import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import './styles/global.css'
import './styles/colors.css'

// Providers
import AuthProvider from "./contexts/auth/AuthProvider";
import ToastProvider from "./contexts/toast/ToastProvider";

// Pages
import Login from "./pages/Login";
import Main from "./layouts/Main";

// Layout outlets
import Produto from "./pages/layoutOutlets/Produto";
import Fornecedor from "./pages/layoutOutlets/Fornecedor";
import Grupo from "./pages/layoutOutlets/Grupo";
import Usuario from "./pages/layoutOutlets/Usuario";
import Unificacao from "./pages/layoutOutlets/Unificacao";
import Transportador from "./pages/layoutOutlets/Transportador";
import Requisicao from "./pages/layoutOutlets/Requisicao";
import Cotacao from "./pages/layoutOutlets/Cotacao";
import AlterarDados from "./pages/layoutOutlets/AlterarDados";
import ErrorBoundary from "./utils/error/ErrorBoundary";
import Home from "./pages/layoutOutlets/Home";
import ProdutoInformacoes from "./pages/layoutOutlets/ProdutoInformacoes";
import Clonagem from "./pages/layoutOutlets/Clonagem";
import Pedido from "./pages/layoutOutlets/Pedidos";
import Margem from "./pages/layoutOutlets/Margem";
import Administracao from "./pages/layoutOutlets/Administracao";
import Orcamentos from './pages/layoutOutlets/Orcamentos'
import Clientes from './pages/layoutOutlets/Clientes'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <ToastProvider>
                <ErrorBoundary>
                    <AuthProvider>
                        <QueryClientProvider client={queryClient}>
                            <Routes>
                                <Route path={"/"} element={<Login/>}/>

                                <Route element={<Main/>}>
                                    <Route path={"/produto/*"} element={<Produto/>}/>
                                    <Route path={"/fornecedor/*"} element={<Fornecedor/>}/>
                                    <Route path={"/grupo/*"} element={<Grupo/>}/>
                                    <Route path={"/usuario/*"} element={<Usuario/>}/>
                                    <Route path={"/unificacao/*"} element={<Unificacao/>}/>
                                    <Route path={"/transportador/*"} element={<Transportador/>}/>
                                    <Route path={"/requisicao/*"} element={<Requisicao/>}/>
                                    <Route path={"/cotacao/*"} element={<Cotacao/>}/>
                                    <Route path={"/clonagem/*"} element={<Clonagem/>}/>
                                    <Route path={"/alterarDados/*"} element={<AlterarDados/>}/>
                                    <Route path={"/pedido/*"} element={<Pedido/>}/>
                                    <Route path={"/home/*"} element={<Home/>}/>
                                    <Route path={"/margem/*"} element={<Margem/>}/>
                                    <Route path={"/produto/informacoes/*"} element={<ProdutoInformacoes/>}/>
                                    <Route path={"/administracao/*"} element={<Administracao/>}/>
                                    <Route path={"/orcamentos"} element={<Orcamentos/>}/>
                                    <Route path={"/clientes"} element={<Clientes/>}/>
                                </Route>

                                {/*Temporário*/}
                                <Route path={"/*"} element={<Login/>} />
                            </Routes>
                        </QueryClientProvider>
                    </AuthProvider>
                </ErrorBoundary>
            </ToastProvider>
        </Router>
    </StrictMode>,
)
