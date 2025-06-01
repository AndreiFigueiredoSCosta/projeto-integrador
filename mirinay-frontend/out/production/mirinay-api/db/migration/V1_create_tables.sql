-- Criação da tabela endereco
CREATE TABLE endereco (
                          codigo SERIAL NOT NULL PRIMARY KEY,
                          cep VARCHAR(15),
                          numero VARCHAR(10),
                          cidade VARCHAR(255),
                          bairro VARCHAR(255),
                          uf VARCHAR(5)
);

-- Criação da tabela marca
CREATE TABLE marca (
                       id_marca SERIAL NOT NULL PRIMARY KEY,
                       nome VARCHAR(255)
);

-- Criação da tabela grupo
CREATE TABLE grupo (
                            id SERIAL PRIMARY KEY,
                            nome VARCHAR(255),
                            descricao VARCHAR(255) NOT NULL,
                            status BOOLEAN,
                            margem NUMERIC
);

-- Criação da tabela subgrupo
CREATE TABLE subgrupo (
                            id SERIAL PRIMARY KEY,
                            nome VARCHAR(255),
                            descricao VARCHAR(255) NOT NULL,
                            margem NUMERIC,
                            status BOOLEAN,
                            id_grupo INTEGER,
                            CONSTRAINT fk_grupo FOREIGN KEY (id_grupo) REFERENCES grupo(id) ON DELETE SET NULL
);

-- Criação da tabela fabricante
CREATE TABLE fabricante (
                            codigo SERIAL NOT NULL PRIMARY KEY,
                            endereco INT,
                            nome VARCHAR(255) NOT NULL,
                            descricao VARCHAR(255),
                            telefone VARCHAR(20),
                            email VARCHAR(255) UNIQUE,
                            FOREIGN KEY (endereco) REFERENCES endereco(codigo) ON DELETE CASCADE
);

-- Criação da tabela grupofornecedor
CREATE TABLE grupo_fornecedor (
                            codigo SERIAL NOT NULL PRIMARY KEY,
                            nome VARCHAR(255)
);

-- Criação da tabela fornecedor
CREATE TABLE fornecedor (
                            codigo SERIAL NOT NULL PRIMARY KEY,
                            codigogrupofornecedor INT,
                            endereco INT,
                            nome_fantasia VARCHAR(255),
                            tipo VARCHAR(6),
                            data_alteracao INT,
                            cnpj VARCHAR(20),
                            fone VARCHAR(20),
                            email VARCHAR(255),
                            desconto INT,
                            status boolean,
                            FOREIGN KEY (endereco) REFERENCES endereco(codigo) ON DELETE CASCADE
);
CREATE TABLE unidadeMedida (
                         id_unidade SERIAL PRIMARY KEY,
                         nome VARCHAR(50) NOT NULL,
                         status boolean,
                         sigla VARCHAR(10) NOT NULL

);
-- Criação da tabela produto
CREATE TABLE produto (
                         id_produto SERIAL NOT NULL PRIMARY KEY,
                         codigo_referencia VARCHAR(255),
                         nome VARCHAR(255) NOT NULL,
                         descricao VARCHAR(255),
                         data_cadastro DATE,
                         aplicacao VARCHAR(100),
                         status boolean,
                         id_subgrupo INT,
                         id_unidade INT,
                         FOREIGN KEY (id_unidade) REFERENCES unidadeMedida(id_unidade) ON DELETE SET NULL,
                         FOREIGN KEY (id_subgrupo) REFERENCES subgrupo(id) ON DELETE SET NULL
);
CREATE TABLE produto_similar (
                         id_produto_similar SERIAL NOT NULL PRIMARY KEY,
                         codigo_referencia VARCHAR(255),
                         descricao VARCHAR(255),
                         data_cadastro DATE,
                         quantidade_estoque INT,
                         marca VARCHAR(100),
                         observacao VARCHAR(100),
                         preco_venda NUMERIC(10, 2),
                         status boolean,
                         id_produto_pai INT,
                         id_subgrupo INT,
                         FOREIGN KEY (id_produto_pai) REFERENCES produto(id_produto) ON DELETE CASCADE,
                         FOREIGN KEY (id_subgrupo) REFERENCES subgrupo(id) ON DELETE SET NULL
);

-- Criação da tabela grupoprodutofornecedor
CREATE TABLE grupoprodutofornecedor (
                         codigo SERIAL NOT NULL PRIMARY KEY,
                         codigo_fornecedor INT,
                         codigo_produto INT,
                         status boolean,
                         nome VARCHAR(255),
                         FOREIGN KEY (codigo_produto) REFERENCES produto_similar(id_produto_similar),
                         FOREIGN KEY (codigo_fornecedor) REFERENCES fornecedor(codigo)
);

-- Criação da tabela usuario
CREATE TABLE usuario (
                         id SERIAL UNIQUE PRIMARY KEY,
                         name VARCHAR,
                         email VARCHAR,
                         password VARCHAR,
                         status BOOLEAN,
                         role VARCHAR,
                         telefone VARCHAR,
                         gender VARCHAR,
                         created_at DATE,
                         updated_at DATE
);

-- Criação da tabela requisicao
CREATE TABLE requisicao (
                          id_requisicao SERIAL PRIMARY KEY,
                          data DATE NOT NULL,
                          nome_cliente VARCHAR(255) NOT NULL,
                          unidades VARCHAR(100) NOT NULL,
                          prioridade VARCHAR(100) NOT NULL,
                          observacao VARCHAR(255) NOT NULL,
                          destino VARCHAR(255) NOT NULL,
                          estado VARCHAR(100) NOT NULL,
                          usuario_id INTEGER NOT NULL,
                          FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Criação da tabela lista_produto
CREATE TABLE lista_produto (
                           id SERIAL PRIMARY KEY,
                           quantidade INTEGER NOT NULL,
                           aprovacao BOOLEAN NOT NULL,
                           fornecedores_id INTEGER NOT NULL,
                           requisicao_id INTEGER NOT NULL,
                           produto_id INTEGER NOT NULL,
                           produto_similar_id INTEGER,
                           usuario_id INTEGER NOT NULL,
                           FOREIGN KEY (usuario_id) REFERENCES usuario(id),
                           FOREIGN KEY (fornecedores_id) REFERENCES grupoprodutofornecedor(codigo),
                           FOREIGN KEY (requisicao_id) REFERENCES requisicao(id_requisicao),
                           FOREIGN KEY (produto_id) REFERENCES produto(id_produto)
);


CREATE TABLE transportadora (
                           transportadora_id SERIAL PRIMARY KEY,
                           status boolean,
                           nome VARCHAR(255) NOT NULL
);

CREATE TABLE transportadora_filial (
                                id_filial SERIAL PRIMARY KEY,
                                nome VARCHAR(255) NOT NULL,
                                cnpj VARCHAR(20) NOT NULL,
                                telefone VARCHAR(20) NOT NULL,
                                email VARCHAR(255) NOT NULL,
                                tipo VARCHAR(255) NOT NULL,
                                status BOOLEAN NOT NULL,
                                endereco INT,
                                transportadora_id INT,
                                FOREIGN KEY (transportadora_id) REFERENCES transportadora(transportadora_id) ON DELETE CASCADE,
                                FOREIGN KEY (endereco) REFERENCES endereco(codigo) ON DELETE CASCADE
);
