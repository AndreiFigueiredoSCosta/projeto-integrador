import './style.css';
import useLogout from '../../../hooks/useLogout.ts';
import { FaUserCircle } from 'react-icons/fa';
import { useState, useEffect } from "react";
import axios from "axios";

export function UserMenu() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [dados, setDados] = useState<{ email: string; name: string; telefone: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const handleLogout = useLogout();
    const API_URL = process.env.API_URL || '';
    const getCookie = (nome: string): string | null => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [chave, valor] = cookie.split("=");
            if (chave === nome) {
                return decodeURIComponent(valor);
            }
        }
        return null;
    };

    const token = getCookie("access_token");

    useEffect(() => {
        if (!token) {
            setError("Token de autenticação não encontrado.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/usuario/menu`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 22000,
                });

                setDados(response.data); // Armazena os dados do usuário
            } catch (err) {
                console.error("Erro ao buscar usuário:", err);
                setError("Erro ao carregar os dados do usuário.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) return <p>🔄 Carregando...</p>;
    if (error) return <p>❌ {error}</p>;

    // Usa os dados da API se disponíveis
    const usuario = dados || {
        name: "Usuário",
        email: "E-mail não encontrado",
        telefone: "Não informado"
    };

    return (
        <div className="user-menu-container">
            <div className="user-info" onClick={() => setMenuAberto((prev) => !prev)}>
                <span>{usuario.name}</span>
                <FaUserCircle size={24} />
            </div>

            {menuAberto && (
                <div className="dropdown-menu">
                    <div className="user-details">
                        <p>Logado como <strong>{usuario.email}</strong></p>
                        <p>Telefone: <strong>{usuario.telefone}</strong></p>
                    </div>
                    <div className="menu-options">
                        <button className="menu-item">Alterar Dados</button>
                        <button className="menu-item">Alterar Unidade</button>
                    </div>
                    <div className="logout-section">
                        <button className="logout-button" onClick={handleLogout}>SAIR</button>
                    </div>
                </div>
            )}
        </div>
    );
}
