import EstagioEnum from "../enums/EstagioEnum.ts";
import EstadoEnum from "../enums/EstadoEnum.ts";

/**
 * Este arquivo é responsável por retornar um objeto com as urls de cada endpoint da API.
 */
export default function useEndpoint(){
    return {
        grupo: () => {
            const grupoUrl = "/grupo";
            return {
                informacoes: (grupoId?: number) => {
                    return {
                        todos: `${grupoUrl}`,
                        unico: `${grupoUrl}/detalhes/${grupoId}`,
                        subgrupos: `${grupoUrl}/detalhes/${grupoId}/subgrupos`,
                    }
                },
                buscas(label: string) {
                    return {
                        todos: `${grupoUrl}/buscar?label=${label}`,
                        select: `${grupoUrl}/buscar/select?label=${label}`
                    };
                },
                operacoes: (grupoId?: number) => {
                    return {
                        cadastrar: `${grupoUrl}/cadastrar`,
                        editar: `${grupoUrl}/editar`,
                        deletar: `${grupoUrl}/${grupoId}`
                    }
                },
                search() {
                    return {
                        nome: (label: string) => `${grupoUrl}/buscar/nome?label=${label}`,
                        id: (label: string) => `${grupoUrl}/buscar/id?label=${label}`,
                        subgrupo() {
                            return {
                                id: (label: string) => `${grupoUrl}/buscar/subgrupo/id?label=${label}`,
                                nome: (label: string) => `${grupoUrl}/buscar/subgrupo/nome?label=${label}`
                            }
                        }
                    }
                }
            }
        },
        subgrupo: () => {
            const subgrupoUrl = "/subgrupo";

            return {
                informacoes: (subgrupoId?: number) => {
                    return {
                        todos: `${subgrupoUrl}`,
                        unico: `${subgrupoUrl}/detalhes/${subgrupoId}`,
                        produtos: `${subgrupoUrl}/detalhes/${subgrupoId}/produtos`,
                    }
                },
                buscas(label: string) {
                    return {
                        todos: `${subgrupoUrl}/buscar?label=${label}`,
                        select: `${subgrupoUrl}/buscar/select?label=${label}`
                    };
                },
                operacoes: (subgrupoId?: number) => {
                    return {
                        cadastrar: `${subgrupoUrl}/cadastrar`,
                        editar: `${subgrupoUrl}/editar`,
                        deletar: `${subgrupoUrl}/${subgrupoId}`
                    }
                },
                search: () => {
                    return {
                        id: (label: string) => `${subgrupoUrl}/buscar/id?label=${label}`,
                        nome: (label: string) => `${subgrupoUrl}/buscar/nome?label=${label}`
                    }
                }
            }
        },
        fornecedor: () => {
            const fornecedorUrl = "/fornecedor";
            return {
                informacoes: (forncedorId?: number) => {
                    return {
                        todos: `${fornecedorUrl}`,
                        unico: `${fornecedorUrl}/detalhes/${forncedorId}`,
                        cnpjs: `${fornecedorUrl}/detalhes/${forncedorId}/cnpj`,
                    }
                },
                buscas(label: string) {
                    return {
                        todos: `${fornecedorUrl}/buscar?label=${label}`,
                        select: `${fornecedorUrl}/buscar/select?label=${label}`
                    };
                },
                operacoes: (forncedorId?: number) => {
                    return {
                        cadastrar: `${fornecedorUrl}/cadastrar`,
                        editar: `${fornecedorUrl}/editar`,
                        deletar: `${fornecedorUrl}/${forncedorId}`
                    }
                },
                search() {
                    return {
                        nome: (label: string) => `${fornecedorUrl}/buscar/nome?label=${label}`,
                        id: (label: string) => `${fornecedorUrl}/buscar/id?label=${label}`,
                        cnpj: () => {
                            return {
                                id: (label: string) => `${fornecedorUrl}/buscar/cnpj/id?label=${label}`,
                                nome: (label: string) => `${fornecedorUrl}/buscar/cnpj/nome?label=${label}`,
                                cnpj: (label: string) => `${fornecedorUrl}/buscar/cnpj/cnpj?label=${label}`
                            }
                        }
                    }
                }
            }
        },
        fornecedorCNPJ: () => {
            const fornecedorUrl = "/fornecedorcnpj";
            return {
                informacoes: (forncedorCnpjId?: number) => {
                    return {
                        todos: `${fornecedorUrl}`,
                        unico: `${fornecedorUrl}/detalhes/${forncedorCnpjId}`,
                    }
                },
                buscas(label: string) {
                    return {
                        todos: `${fornecedorUrl}/buscar?label=${label}`,
                        select: `${fornecedorUrl}/buscar/select?label=${label}`,
                        selectFromFornecedor: (fornecedorId: number) => {
                            return `${fornecedorUrl}/buscar/select/${fornecedorId}/cnpj?label=${label}`
                        }
                    };
                },
                operacoes: (forncedorCnpjId?: number) => {
                    return {
                        cadastrar: `${fornecedorUrl}/cadastrar`,
                        editar: `${fornecedorUrl}/editar`,
                        deletar: `${fornecedorUrl}/${forncedorCnpjId}`,
                        alterarTipo: `${fornecedorUrl}/tornarMatriz/${forncedorCnpjId}`
                    }
                },
            }
        },
        produto: () => {
            const mainUrl = "/produto";
            return {
                informacoes: (produtoId?: number) => {
                    return {

                        componentes: `${mainUrl}/detalhes/${produtoId}/componentes`,
                        conjuntos: `${mainUrl}/detalhes/${produtoId}/conjuntos`,
                        subgrupo: (subgrupoId?: number) => {
                            return {
                                todos: `${mainUrl}/detalhes/${produtoId}/subgrupo/${subgrupoId}`,
                            }
                        },
                        unico: `${mainUrl}/detalhes/${produtoId}`,
                        similares: `${mainUrl}/detalhes/${produtoId}/similares`,
                        getUltimosPedidos: `${mainUrl}/detalhes/${produtoId}/ultimos-pedidos`,
                    }
                },
                buscar(label: string) {
                    return {
                        select: `${mainUrl}/buscar/select?label=${label}`,
                        todos: `${mainUrl}/buscar?label=${label}`,
                        similaresDeProduto: (produtoId: number) => `${mainUrl}/buscar/${produtoId}/select?label=${label}`
                    }
                },
                operacoes: (produtoId?: number) => {
                    return {
                        deletar: `${mainUrl}/${produtoId}`,
                        cadastrar: `${mainUrl}/cadastrar`,
                        editar: `${mainUrl}/editar/${produtoId}`,
                        componente: (componenteId?: number) => {
                            return {
                                addComponente: `${mainUrl}/inserirComponente/${produtoId}/componente/${componenteId}`,
                                addConjunto: `${mainUrl}/inserirComponente/${componenteId}/componente/${produtoId}`,
                                removerComponente: `${mainUrl}/removerComponente/${produtoId}/componente/${componenteId}`,
                                removerConjunto: `${mainUrl}/removerComponente/${componenteId}/componente/${produtoId}`,
                            }
                        }
                    }
                },
                search: () =>{
                    return {
                        nome: (label: string) => `${mainUrl}/buscar/nome?label=${label}`,
                        id: (label: string) => `${mainUrl}/buscar/id?label=${label}`,
                        referencia: (label: string) => `${mainUrl}/buscar/referencia?label=${label}`
                    }
                }
            }
        },
        similar: () => {
            const produtoUrl = "/produto";
            return {
                informacoes: (produtoId?: number) => {
                    return {
                        todos: `${produtoUrl}/detalhes/${produtoId}/similares`,
                    }
                },
                buscar(label: string) {
                    return {
                        select: `${produtoUrl}/buscar/similar/select?label=${label}`,
                        todos: `${produtoUrl}/buscar/similar?label=${label}`,
                        clonagensDeSimilar: (similarId: number) => {
                            return `${produtoUrl}/detalhes/${similarId}/similar/clonagens/buscar?label=${label}`
                        },
                    }
                },
                operacoes: (produtoId?: number, similarId?: number) => {
                    return {
                        cadastrar: `${produtoUrl}/cadastrar/similar/${produtoId}`,
                        editar: `${produtoUrl}/editar/similar/${similarId}`,
                        deletar: `${produtoUrl}/similar/${similarId}`
                    }
                }
            }
        },
        requisicao: () => {
            const mainUrl = "/requisicao";
            return {
                informacoes: () => {
                    return {
                        todos: `${mainUrl}`,
                        concluidos: `${mainUrl}/concluido`,
                        subinformacoes: (requisicaoId: number) => {
                            return {
                                detalhes: `${mainUrl}/detalhes/${requisicaoId}`,
                                construcao: `${mainUrl}/detalhes/${requisicaoId}/construcao`,
                                cotacao: `${mainUrl}/detalhes/${requisicaoId}/cotacao`,
                                aprovacao:`${mainUrl}/detalhes/${requisicaoId}/aprovacao`,
                                pedido: `${mainUrl}/detalhes/${requisicaoId}/pedido`,
                                concluido:`${mainUrl}/detalhes/${requisicaoId}/concluido`
                            }
                        },
                    }
                },
                buscas(label: string) {
                    return {
                        todos: `${mainUrl}/buscar?label=${label}`,
                        select: `${mainUrl}/buscar/select?label=${label}`
                    };
                },
                operacoes: (requisicaoId: number) => {
                    return {
                        geral: () =>{
                            return {
                                avancar: (estagio: string)=> `${mainUrl}/detalhes/${requisicaoId}/avancar?estagio=${estagio}`,
                                editar: `${mainUrl}/detalhes/${requisicaoId}/editar`,
                                deletar: `${mainUrl}/detalhes/${requisicaoId}/excluir`,
                                cadastrar: `${mainUrl}/cadastrar`
                            }
                        },
                        construcao: () => {
                            return {
                                inserir: `${mainUrl}/detalhes/${requisicaoId}/construcao/inserir`,
                                editar: `${mainUrl}/detalhes/${requisicaoId}/construcao/editar`,
                                deletar: (auxId?: number) => `${mainUrl}/detalhes/${requisicaoId}/construcao/${auxId}/excluir`
                            }
                        },
                        cotacao: () => {
                            return {
                                inserir: `${mainUrl}/detalhes/${requisicaoId}/cotacao/inserir`,
                                addAlerta: `${mainUrl}/detalhes/${requisicaoId}/cotacao/addAlerta`
                            }
                        },
                        aprovacao: (itemId: number) => {
                            return {
                                alterar: `${mainUrl}/detalhes/${requisicaoId}/aprovacao/${itemId}/alterar`,
                                aprovar: `${mainUrl}/detalhes/${requisicaoId}/aprovacao/${itemId}/aprovar`,
                                reprovar: `${mainUrl}/detalhes/${requisicaoId}/aprovacao/${itemId}/reprovar`

                            }
                        }
                    }
                },
                search() {
                    return {
                        pendente() {
                            return {
                                nome: (label: string) => `${mainUrl}/buscar/pendente/nome?label=${label}`,
                                id: (label: string) => `${mainUrl}/buscar/pendente/id?label=${label}`
                            }
                        },
                        concluida() {
                            return {
                                nome: (label: string) => `${mainUrl}/buscar/concluida/nome?label=${label}`,
                                id: (label: string) => `${mainUrl}/buscar/concluida/id?label=${label}`
                            }
                        }
                    }
                }
            }
        },
        cotacao: () => {
            const mainUrl = "/cotacao";
            return {
                GET: () => {
                    return {
                        todos: `${mainUrl}`,
                        concluidos: `${mainUrl}/concluido`,
                        detalhes: (requisicaoId: number) => {
                            return {
                                informacoes: `${mainUrl}/detalhes/${requisicaoId}`,
                                revisao: () => {
                                    return {
                                        produto: () => {
                                            return {
                                                itens: `${mainUrl}/detalhes/${requisicaoId}/revisao/item`,
                                                similaresDeItem: (itemId: number) => `${mainUrl}/detalhes/${requisicaoId}/revisao/item/${itemId}/similar`,
                                                cotacoesDeItem: (itemId: number) => `${mainUrl}/detalhes/${requisicaoId}/revisao/item/${itemId}/cotacao`,
                                            }
                                        },
                                        fornecedor: () => {
                                            return {
                                                cnpjs: `${mainUrl}/detalhes/${requisicaoId}/revisao/fornecedor`,
                                                idsJaInseridosDeFornecedor: (fornecedorId: number) => `${mainUrl}/detalhes/${requisicaoId}/revisao/fornecedor/${fornecedorId}/cnpj`,
                                            }
                                        }
                                    }
                                },
                                cotacao: () => {
                                    return {
                                        dados: `${mainUrl}/detalhes/${requisicaoId}/cotacao/cotados`,
                                        itens: () => {
                                            return {
                                                itens: `${mainUrl}/detalhes/${requisicaoId}/cotacao/item`,
                                                cotacoes: (itemId: number) => `${mainUrl}/detalhes/${requisicaoId}/cotacao/item/${itemId}/fornecedor`
                                            }
                                        },
                                        cotacoes: () => {
                                            return {
                                                fornecedores: `${mainUrl}/detalhes/${requisicaoId}/cotacao/fornecedor`,
                                                excel: (cnpjId: number) => `${mainUrl}/exportar/${requisicaoId}/fornecedor/${cnpjId}`,
                                                itens: (cnpjId: number) => `${mainUrl}/detalhes/${requisicaoId}/cotacao/fornecedor/${cnpjId}/item`
                                            }
                                        }
                                    }
                                },
                                aprovacao: () => {
                                    return {
                                        dados: `${mainUrl}/detalhes/${requisicaoId}/aprovacao/aprovados`,
                                        itens: `${mainUrl}/detalhes/${requisicaoId}/aprovacao`,
                                        cotacoes: (itemId: number) => `${mainUrl}/detalhes/${requisicaoId}/aprovacao/${itemId}/fornecedores`
                                    }
                                },
                                concluido: () => {
                                    return {
                                        itens: `${mainUrl}/detalhes/${requisicaoId}/concluido`,
                                        cotacoes: (itemId: number) => `${mainUrl}/detalhes/${requisicaoId}/concluido/${itemId}/cotacao`
                                    }
                                }
                            }
                        },
                        SEARCH(label?: string) {
                            return {
                                select: `${mainUrl}/buscar/select?label=${label}`,
                                nome: (label: string) => `${mainUrl}/buscar/nome?label=${label}`,
                                id: (label: string) => `${mainUrl}/buscar/id?label=${label}`
                            };
                        }
                    }
                },
                POST: () => {
                    return {
                        revisao: (requisicaoId: number) => {
                            return {
                                item: () => {
                                    return {
                                        clonar: (itemId: number, clonagemId: number) => `${mainUrl}/detalhes/${requisicaoId}/revisao/item/${itemId}/clonar/${clonagemId}`,
                                        cadastrarProduto: `${mainUrl}/detalhes/${requisicaoId}/revisao/item/produto/cadastrar`,
                                        cadastrarSimilar: `${mainUrl}/detalhes/${requisicaoId}/revisao/item/similar/cadastrar`,
                                        inserir: `${mainUrl}/detalhes/${requisicaoId}/revisao/item/inserir`,
                                        inserirCnpjs: (itemId: number) => `${mainUrl}/detalhes/${requisicaoId}/revisao/item/${itemId}/fornecedor/inserir`,
                                    }
                                },
                                fornecedor: () => {
                                    return {
                                        inserir: `${mainUrl}/detalhes/${requisicaoId}/revisao/fornecedor/inserir`,
                                    }
                                }
                            }
                        },
                        cotacao: (cotacaoId: number) => {
                            return {
                                inserir: `${mainUrl}/detalhes/${cotacaoId}/cotacao/inserir`,
                                editar: `${mainUrl}/detalhes/${cotacaoId}/cotacao/editar`,
                                deletar: (itemId: number) => `${mainUrl}/detalhes/${cotacaoId}/cotacao/${itemId}/excluir`
                            }
                        }
                    }
                },
                PATCH: () => {
                    return {
                        alterarEstado: (requisicaoId: number, estagio: EstagioEnum) => `${mainUrl}/detalhes/${requisicaoId}/estagio/${estagio}/alterar`,
                        revisao: (requisicaoId: number) => {
                            return {
                                item: (itemId: number) => {
                                    return {
                                        selecionarSimilar: `${mainUrl}/detalhes/${requisicaoId}/revisao/produto/${itemId}/similar/selecionar`,
                                        alterarReferencia: (similarId: number) => `${mainUrl}/detalhes/${requisicaoId}/revisao/item/${itemId}/similar/${similarId}/alterar`,
                                        alterarCnpjCotacao: (cotacaoId: number, cnpjId: number)=> `${mainUrl}/detalhes/${requisicaoId}/revisao/item/${itemId}/cotacao/${cotacaoId}/alterarCNPJ/${cnpjId}`
                                    }
                                }
                            }
                        },
                        cotacao: (requisicaoId: number) => {
                            return {
                                reaproveitar: (itemId: number, cotacaoId: number, quantidade: number) =>`${mainUrl}/detalhes/${requisicaoId}/cotacao/item/${itemId}/fornecedor/${cotacaoId}/reaproveitar/${quantidade}`
                            }
                        },
                        aprovacao: (requisicaoId: number) => {
                            return {
                                aprovar: `${mainUrl}/detalhes/${requisicaoId}/aprovacao/aprovar`,
                                reprovar: `${mainUrl}/detalhes/${requisicaoId}/aprovacao/reprovar`,
                                item: () => {
                                    return {
                                        alterar: (itemId: number, estado: EstadoEnum) => `${mainUrl}/detalhes/${requisicaoId}/aprovacao/item/${itemId}/alterar/estado/${estado}`
                                    }
                                },
                                cotacao: () => {
                                    return {
                                        classificar: `${mainUrl}/detalhes/${requisicaoId}/aprovacao/fornecedor/classificar`,
                                        alterar: (cotacaoId: number, estado: EstadoEnum) => `${mainUrl}/detalhes/${requisicaoId}/aprovacao/cotacao/${cotacaoId}/alterar/estado/${estado}`
                                    }
                                }
                            }
                        }
                    }
                },
                PUT:() => {
                    return {
                        revisao: (requisicaoId: number) => {
                            return {
                                item: () => {
                                    return {
                                        editar: `${mainUrl}/detalhes/${requisicaoId}/revisao/item/editar`,
                                    }
                                }
                            }
                        },
                        cotacao: (requisicaoId: number) => {
                            return {
                                cotar: (itemId: number, cotacaoId: number) => `${mainUrl}/detalhes/${requisicaoId}/cotacao/item/${itemId}/fornecedor/${cotacaoId}/cotar`
                            }
                        }
                    }
                },
                DELETE: () => {
                    return {
                        revisao: (requisicaoId: number) => {
                            return {
                                item: (itemId?: number) => {
                                    return {
                                        remover: `${mainUrl}/detalhes/${requisicaoId}/revisao/item/excluir`,
                                        removerCotacao: `${mainUrl}/detalhes/${requisicaoId}/revisao/item/${itemId}/fornecedor/excluir`
                                    }
                                },
                                fornecedor: () => {
                                    return {
                                        remover: `${mainUrl}/detalhes/${requisicaoId}/revisao/fornecedor/excluir`
                                    }
                                }
                            }
                        },
                        cotacao: (requisicaoId: number) => {
                            return {
                                desclassificar: () => {
                                    return {
                                        item: (itemId: number) =>`${mainUrl}/detalhes/${requisicaoId}/cotacao/item/${itemId}/desclassificar`,
                                        cotacao: (cotacaoId: number) => `${mainUrl}/detalhes/${requisicaoId}/cotacao/cotacao/${cotacaoId}/desclassificar`
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        unidade(unidadeId?: number) {
            const mainUrl = "/unidade-medida";
            return {
                todos: `${mainUrl}`,
                cadastrar: `${mainUrl}/cadastrar`,
                deletar: `${mainUrl}/${unidadeId}`,
                editar: `${mainUrl}/editar`,
                select: (label: string) =>
                {
                    return `${mainUrl}/buscar/select?label=${label}`
                },
                search() {
                    return {
                        sigla_nome: (label: string) => `${mainUrl}/buscar/sigla-nome?label=${label}`
                    }
                }
            }
        },
        condicaoPagamento(condPagamentoId?: number) {
            const mainUrl = "/condicao-pagamento";
            return {
                todos: `${mainUrl}`,
                cadastrar: `${mainUrl}/cadastrar`,
                deletar: `${mainUrl}/${condPagamentoId}`,
                editar: `${mainUrl}/editar`,
                select: (label: string) =>
                {
                    return `${mainUrl}/buscar/select?label=${label}`
                },
                search() {
                    return {
                        sigla_nome: (label: string) => `${mainUrl}/buscar/sigla-nome?label=${label}`
                    }
                }
            }
        },
        marca(marcaId?: number) {
            const mainUrl = "/marca";
            return {
                todos: `${mainUrl}`,
                cadastrar: `${mainUrl}/cadastrar`,
                deletar: `${mainUrl}/${marcaId}`,
                editar: `${mainUrl}/editar`,
                select(label: string) {
                    return `${mainUrl}/buscar/select?label=${label}`;
                },
                search() {
                    return {
                        nome: (label: string) => `${mainUrl}/buscar/nome?label=${label}`,
                        id: (label: string) => `${mainUrl}/buscar/id?label=${label}`
                    }
                }
            }
        },
        unificacao() {
            const mainUrl = "/unificacao";
            return {
                todos: `${mainUrl}`,
                unificar: `${mainUrl}/unificar`,
                search() {
                    return {
                        grupo: () => {
                            return {
                                nome: (label: string) => `${mainUrl}/buscar/grupo/nome?label=${label}`,
                                id: (label: string) => `${mainUrl}/buscar/grupo/id?label=${label}`
                            }
                        },
                        produto: () => {
                            return {
                                nome: (label: string) => `${mainUrl}/buscar/produto/nome?label=${label}`,
                                id: (label: string) => `${mainUrl}/buscar/produto/id?label=${label}`
                            }
                        }
                    }
                }
            }
        },
        clonagem(clonagemId?: number) {
            const mainUrl = "/clonagem";
            return {
                todos: `${mainUrl}`,
                todosSimilares: `${mainUrl}/${clonagemId}/similares`,
                select(label: string) {
                    return {
                        clonagem: `${mainUrl}/busca/select?label=${label}`,
                        produto: `${mainUrl}/busca/select/produto?label=${label}`,
                        fornecedor: `${mainUrl}/busca/select/fornecedor?label=${label}`,
                        similar: `${mainUrl}/busca/select/similar?label=${label}`
                    }
                },
                cadastrar(){
                    return {
                        clonagem: `${mainUrl}/cadastrar`
                    }
                },
                editar: `${mainUrl}/${clonagemId}`,
                deletar: `${mainUrl}/${clonagemId}`,
                item() {
                    const itemUrl = "/itemClonagem";
                    return {
                        todos(){
                            return {
                                produto: `${itemUrl}/${clonagemId}/produto`,
                                similar(produtoId: number) {
                                    return `${itemUrl}/${clonagemId}/produto/${produtoId}`
                                },
                                fornecedor: `${itemUrl}/${clonagemId}/fornecedor`,
                            }
                        },
                        cadastrar(){
                            return {
                                fornecedor: `${itemUrl}/cadastrar/fornecedor`,
                                produto: `${itemUrl}/cadastrar/produto`
                            }
                        },
                        deletar(auxId: number){
                            return {
                                fornecedor: `${itemUrl}/${clonagemId}/fornecedor/${auxId}`,
                                similar: `${itemUrl}/${clonagemId}/similar/${auxId}`,
                                produto: `${itemUrl}/${clonagemId}/produto/${auxId}`
                            }
                        }
                    }
                },
                search() {
                    return {
                        nome: (label: string) => `${mainUrl}/buscar/nome?label=${label}`
                    }
                }
            }
        },
        transportador() {
            const transportadorUrl = "/transportador";
            return {
                informacoes: (transportadorId?: number) => {
                    return {
                        todos: `${transportadorUrl}`,
                        unico: `${transportadorUrl}/detalhes/${transportadorId}`,
                        cnpjs: `${transportadorUrl}/detalhes/${transportadorId}/cnpj`,
                    }
                },
                buscas(label: string) {
                    return {
                        todos: `${transportadorUrl}/buscar?label=${label}`,
                        select: `${transportadorUrl}/buscar/select?label=${label}`
                    };
                },
                operacoes: (transportadorId?: number) => {
                    return {
                        cadastrar: `${transportadorUrl}/cadastrar`,
                        editar: `${transportadorUrl}/editar`,
                        deletar: `${transportadorUrl}/${transportadorId}`
                    }
                },
                search() {
                    return {
                        nome: (label: string) => `${transportadorUrl}/buscar/nome?label=${label}`,
                        id: (label: string) => `${transportadorUrl}/buscar/id?label=${label}`
                    }
                }
            }
        },
        transportadorCnpj() {
            const transportadorUrl = "/transportador";
            return {
                informacoes: (transportadorId?: number, cnpjId?: number) => {
                    return {
                        todos: `${transportadorUrl}/detalhes/${transportadorId}/cnpj`,
                        unico: `${transportadorUrl}/${transportadorId}/cnpj/${cnpjId}`,
                        cnpjs: `${transportadorUrl}/detalhes/${transportadorId}/cnpjs`,
                    }
                },
                buscas(label: string, transportadorId: number) {
                    return {
                        select: `${transportadorUrl}/buscar/select/${transportadorId}/cnpj?label=${label}`
                    };
                },
                operacoes: (transportadorId?: number, cnpjId?: number) => {
                    return {
                        cadastrar: `${transportadorUrl}/cadastrar/${transportadorId}/cnpjs`,
                        editar: `${transportadorUrl}/editar/cnpj/${cnpjId}`,
                        deletar: `${transportadorUrl}/deletar/cnpj/${cnpjId}`,
                        alterarTipo: `${transportadorUrl}/trocarTipo/${cnpjId}`
                    }
                }
            }
        },
        margem: () => {
            const mainUrl = "/margem";
            return {
                GET: () => {
                    return {
                        todos: `${mainUrl}`,
                        SEARCH: (label?: string) => {
                            return {
                                nome: (label: string) => `${mainUrl}/buscar/nome?label=${label}`,
                                todos: `${mainUrl}/buscar?label=${label}`,
                                select: `${mainUrl}/buscar/select?label=${label}`
                            }
                        }
                    }
                },
                POST: () => {
                    return {
                        cadastrar: `${mainUrl}/cadastrar`
                    }
                },
                PUT: () => {
                    return {
                        editar: `${mainUrl}/editar`
                    }
                },
                DELETE: () => {
                    return {
                        deletar: (margemId: number) => `${mainUrl}/${margemId}`
                    }
                }
            }
        },
        pedido() {
            const  mainUrl = "/pedido";
            return {
                GET: () => {
                    return {
                        pendentes: `${mainUrl}/pendentes`,
                        itens: (itemId: number) => `${mainUrl}/pendentes/${itemId}`,
                        efetuados: `${mainUrl}/efetuados`,
                        concluidos: `${mainUrl}/concluido`,
                        SEARCH: () => {
                            return {
                                pendente: () =>  {
                                    return {
                                        id: (label: string) => `${mainUrl}/buscar/pendentes/id?label=${label}`,
                                        nome: (label: string) => `${mainUrl}/buscar/pendentes/nome?label=${label}`
                                    }
                                },
                                efetuado: () => {
                                    return {
                                        id: (label: string) => `${mainUrl}/buscar/efetuados/id?label=${label}`,
                                        nome: (label: string) => `${mainUrl}/buscar/efetuados/nome?label=${label}`
                                    }
                                }
                            }
                        }
                    }
                },
                POST: () => {
                    return {
                        gerar: `${mainUrl}/gerar`
                    }
                },
                PATCH: () => {
                    return {
                        receber: (pedidoId: number) => `${mainUrl}/efetuados/${pedidoId}/receber`
                    }
                }
            }
        },
        administacao() {
            const  mainUrl = "/admnistrador";
            return {
                GET: () => {
                    return {
                        listar: `${mainUrl}/listar`,
                        listarAcoes: (permissaoId: number) =>  `${mainUrl}/listar/${permissaoId}`,
                        listarAutorizacoes: `${mainUrl}/listar/autorizacao`,
                        listarAutorizacoesAcoes: (autorizacaoId: number) => `${mainUrl}/listar/autorizacao/${autorizacaoId}`,
                        usuarios: (autorizacaoId: number) =>`${mainUrl}/listar/autorizacao/${autorizacaoId}/usuarios`,
                        efetuados: `${mainUrl}/efetuados`,
                        concluidos: `${mainUrl}/concluido`,
                        SEARCH: () => {
                            return {
                                pendente: () =>  {
                                    return {
                                        id: (label: string) => `${mainUrl}/buscar/pendentes/id?label=${label}`,
                                        nome: (label: string) => `${mainUrl}/buscar/pendentes/nome?label=${label}`
                                    }
                                },
                                efetuado: () => {
                                    return {
                                        id: (label: string) => `${mainUrl}/buscar/efetuados/id?label=${label}`,
                                        nome: (label: string) => `${mainUrl}/buscar/efetuados/nome?label=${label}`
                                    }
                                }
                            }
                        }
                    }
                },
                POST: () => {
                    return {
                        gerar: `${mainUrl}/adicionar`,
                        associarAoUsuario: `${mainUrl}/adicionar/permissao/usuario`,
                        registrarUsuario: `${mainUrl}/registrar/usuario`,
                    }
                },
                DELETE: () => {
                    return {
                        deletar:  `${mainUrl}/deletar/autorizacao/acao`,
                    }
                },
                PATCH: () => {
                    return {
                        receber: (pedidoId: number) => `${mainUrl}/efetuados/${pedidoId}/receber`
                    }
                }
            }
        },
        alerta() {
            const mainUrl = "/alerta";
            return {
                item: (itemId: number) => {
                    return {
                        get: `${mainUrl}/item/${itemId}`
                    }
                },
                fornecedor: (fornecedorId: number) => {
                    return {
                        get: `${mainUrl}/fornecedor/${fornecedorId}`
                    }
                }
            }
        },
        usuario(){
            const mainUrl = "/usuario";
            return {
                GET: () => {
                    return {
                        listar: `${mainUrl}/menu`,
                    }
                }
            }
        },
        cliente(){
            const mainUrl = "/cliente";
            return {
                GET: () => {
                    return {
                        listar: `${mainUrl}`,
                        exibirClienteDetalhado: (id: string) => `${mainUrl}/${id}`,
                        buscarPeloNome: (nome: string) => 
                            `${mainUrl}/buscar/nome?label=${nome}`,
                        buscarPeloNomeCpf: (nome: string) => 
                            `${mainUrl}/buscar/cpf?label=${nome}`,
                        buscarPorNumero: (numero: string) =>
                            `${mainUrl}/buscar/numero?label=${numero}`,
                    };
                },
                POST: () => {
                    return {
                        cadastrar: `${mainUrl}/cadastrar`
                    }
                },
                PUT: () => {
                    return{
                        editar: `${mainUrl}/editar`
                    }
                },
                DELETE: () => {
                    return {
                        delete: (id : number) => {
                            return `${mainUrl}/deletar/${id}`
                        }
                    }
                }
            }
        },
        //nao está pronto ainda, fazer pras proximas requisiçoes quando estiverem prontas
        orcamentos() {
            const mainUrl = "/orcamento";
            return {
                GET: () => {
                    return {
                        listar: `${mainUrl}`,
                        exibirOrcamentoDetalhado: (id: string) => `${mainUrl}/${id}`,
                        buscarPeloNomeVendedor: (nome: string) => 
                            `${mainUrl}/buscar/vendedor?label=${nome}`,
                        buscarPeloNomeCliente: (nome: string) => 
                            `${mainUrl}/buscar/cliente?label=${nome}`,
                        buscarPorNumero: (numero: string) =>
                            `${mainUrl}/buscar/numero?label=${numero}`,
                    };
                },
                POST: () => {
                    return {
                        cadastrar: `${mainUrl}/cadastrar`,
                        adicionarSimilar: (idOrcamento: number) =>
                            `${mainUrl}/${idOrcamento}/adicionarSimilar`,
                        editarSimilar: (idOrcamento: number, idSimilar: number) =>
                            `${mainUrl}/${idOrcamento}/editarSimilar/${idSimilar}`,
                    };
                },
                DELETE: () => {
                    return {
                        deletar: (id: string) => `${mainUrl}/deletar/${id}`,
                        deletarSimilar: (idOrcamento: number, idSimilar: number) =>
                            `${mainUrl}/${idOrcamento}/deletarSimilarDoOrcamento/${idSimilar}`,
                    };
                }
            };
        }
    
    };
}
