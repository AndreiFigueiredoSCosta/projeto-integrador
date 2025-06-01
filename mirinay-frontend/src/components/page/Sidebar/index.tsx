import {memo, useState} from 'react';
import { Link } from 'react-router-dom';
import SidebarArrow from "../../../assets/SidebarArrow";
import CadastroIcon from "../../../assets/CadastroIcon";
import ComprasIcon from "../../../assets/ComprasIcon";
import HomeIcon from "../../../assets/HomeIcon";
import './style.css';
import VendasIcon from '../../../assets/VendasIcon';
import ClientesIcon from '../../../assets/ClientesIcon';


const Sidebar = memo(function Sidebar() {

  const [isColapsada] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showProdutosSubMenu, setShowProdutosSubMenu] = useState(false);
  const [showComprasSubMenu, setShowComprasSubMenu] = useState(false);
  const [showVendasSubMenu, setShowVendasSubMenu] = useState(false);

  const abrirSubmenu = () => {
    setIsSubmenuOpen((prevState) => !prevState);
  };

  const fecharSubmenu = () => {
    setIsSubmenuOpen(false);
    setShowSubMenu(false);
    setShowProdutosSubMenu(false);
    setShowComprasSubMenu(false);
    setShowVendasSubMenu(false);
  };

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  const toggleProdutosSubMenu = () => {
    setShowProdutosSubMenu(!showProdutosSubMenu);
  };

  const toggleComprasSubMenu = () => {
    setShowComprasSubMenu(!showComprasSubMenu);
  };

  const toggleVendasSubMenu = () => {
    setShowVendasSubMenu(!showVendasSubMenu);
  };

  return (
      <div className={`container-sidebar ${isColapsada ? 'colapsada' : 'expandida'}`} onMouseLeave={fecharSubmenu}>
          <div className="sidebar">
              <div className="item-sidebar">
                  <Link to="/home">
                      {!isColapsada && <span>Página Inicial</span>}
                      <HomeIcon/>
                  </Link>
              </div>
              <div
                  className={`item-sidebar ${isSubmenuOpen ? 'selected' : ''}`}
                  onClick={abrirSubmenu}
              >
                  <div>
                      <div>
                          {!isColapsada && <span>Compras</span>}
                          <ComprasIcon/>
                      </div>
                  </div>
              </div>

              {/* Submenu para Compras */}
              {isSubmenuOpen && (
                  <div className="sub-menu">
                      <Link to="/requisicao" className="sub-item-sidebar">Requisições</Link>
                      <Link to="/cotacao" className="sub-item-sidebar">Cotações</Link>
                      <Link to="/unificacao" className="sub-item-sidebar">Unificação</Link>
                      <Link to="/pedido" className="sub-item-sidebar">Pedidos</Link>
                      <Link to="/clonagem" className="sub-item-sidebar">Clonagem</Link>
                  </div>
              )}
              <div
                  className={`item-sidebar ${showSubMenu ? 'selected' : ''}`}
                  onClick={toggleSubMenu}
              >
                  <div>
                      {!isColapsada && <span>Cadastros</span>}
                      <CadastroIcon/>
                  </div>
              </div>
              {showSubMenu && (
                  <div className="sub-menu">
                      <div
                          className={`sub-item-sidebar ${showProdutosSubMenu ? 'selected' : ''}`}
                          onClick={toggleProdutosSubMenu}
                      >
                          <span>Produtos</span>
                          <div className={`arrow-icon ${showProdutosSubMenu ? 'rotated' : ''}`}>
                              <SidebarArrow/>
                          </div>
                      </div>
                      {showProdutosSubMenu && (
                          <div className="sub-menu">
                              <div className="sub-menu">
                                  <Link to="/produto" className="sub-item-sidebar">Itens</Link>
                                  <Link to="/grupo" className="sub-item-sidebar">Grupo</Link>
                                  <Link to="/produto/informacoes" className="sub-item-sidebar">Informações</Link>
                              </div>
                          </div>
                      )}

                      <div
                          className={`sub-item-sidebar ${showComprasSubMenu ? 'selected' : ''}`}
                          onClick={toggleComprasSubMenu}
                      >
                          <span>Compras</span>
                          <div className={`arrow-icon ${showComprasSubMenu ? 'rotated' : ''}`}>
                              <SidebarArrow/>
                          </div>
                      </div>


                      {showComprasSubMenu && (
                          <div className="sub-menu">
                              <div className="sub-menu">
                                  <Link to="/transportador" className="sub-item-sidebar">Transportador</Link>
                                  <Link to="/fornecedor" className="sub-item-sidebar">Fornecedor</Link>
                                  <Link to="/margem" className="sub-item-sidebar">Margem</Link>
                              </div>
                          </div>
                      )}
                  </div>
              )}

             <div
                  className={`item-sidebar ${isSubmenuOpen ? 'selected' : ''}`}
                  onClick={toggleVendasSubMenu}
              >
                  <div>
                      <div>
                          {!isColapsada && <span>Vendas</span>}
                          <VendasIcon/>
                      </div>
                  </div>
              </div>

              {/* Submenu para vendas */}
              {showVendasSubMenu && (
                  <div className="sub-menu">
                      <Link to="/orcamentos" className="sub-item-sidebar">Orçamentos</Link>
                      <Link to="/cotacao" className="sub-item-sidebar">Vendas</Link>
                  </div>
              )}

               <div className="item-sidebar">
                  <Link to="/clientes">
                      {!isColapsada && <span>Clientes</span>}
                      <ClientesIcon />
                  </Link>
              </div>
              
          </div>
      </div>
  );
})

export default Sidebar;
