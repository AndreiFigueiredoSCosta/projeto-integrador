package org.example.mirinayapi.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.transportador.dto.CadastroTranportadorDTO;
import org.example.mirinayapi.model.transportador.dto.ResponseTransportador;
import org.example.mirinayapi.model.transportadorCnpj.TransportadorCnpj;
import org.example.mirinayapi.model.transportadorCnpj.dto.CadastroFilialDTO;
import org.example.mirinayapi.model.transportadorCnpj.dto.ResponseFilialDTO;
import org.example.mirinayapi.model.transportadorCnpj.repositories.TransportadorFilialRepository;
import org.example.mirinayapi.model.enums.FornecedorEnum;
import org.example.mirinayapi.model.transportador.Transportador;
import org.example.mirinayapi.model.transportador.repositories.TransportadorRepository;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TransportadorService {

    private final TransportadorRepository transportadorRepository;
    private final TransportadorFilialRepository transportadorFilialRepository;


    public List<SelectDTO> buscarTransportadorSelect(String label){
        List<Transportador> transportador = transportadorRepository.findByNome(label.toLowerCase());
        return transportador.stream().map(transportador1 -> new SelectDTO(transportador1.getTransportadorId(), transportador1.getNome())).collect(Collectors.toList());
    }

    // Cadastrar Transportador
    public ResponseEntity<Transportador> cadastrarTransportador(CadastroTranportadorDTO cadastroDTO) {
        Transportador transportador = new Transportador();
        transportador.setNome(cadastroDTO.nome());
        transportador.setStatus(true);
        Transportador savedTransportador = transportadorRepository.save(transportador);
        return ResponseEntity.ok(savedTransportador);
    }

    // Cadastrar Filial de Transportador
    public ResponseEntity<TransportadorCnpj> cadastrarTransportadorFilial(CadastroFilialDTO cadastroDTO, Long idTransportador) {
        Optional<Transportador> optionalTransportador = transportadorRepository.findByIdAndStatusIsTrue(idTransportador);
        if (optionalTransportador.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Transportador transportador = optionalTransportador.get();

        TransportadorCnpj filial = TransportadorCnpj.builder()
                .nome(cadastroDTO.nome())
                .cnpj(cadastroDTO.cnpj())
                .telefone(cadastroDTO.telefone())
                .email(cadastroDTO.email())
                .tipo(cadastroDTO.tipo())
                .status(true)
                .transportador(transportador)
                .celular(cadastroDTO.celular())
                .build();

        changeMatriz(filial);

        TransportadorCnpj savedFilial = transportadorFilialRepository.save(filial);
        return ResponseEntity.ok(savedFilial);
    }

    // Listar Transportadores com Paginação
    public Page<ResponseTransportador> listarTransportadores(Pageable pageable) {
        Page<Transportador> transportadores = transportadorRepository.findTransportadoresWithStatusTrue(pageable);
        List<ResponseTransportador> responseTransportadors = transportadores.stream()
                .map(transportador -> new ResponseTransportador(transportador.getTransportadorId(), transportador.getNome()))
                .collect(Collectors.toList());
        return new PageImpl<>(responseTransportadors, pageable, transportadores.getTotalElements());
    }

    // Listar Filiais de um Transportador com Paginação
    public List<ResponseFilialDTO> listarTransportadoresFiliais(Long idTransportador) {
        Optional<Transportador> optionalTransportador = transportadorRepository.findByIdAndStatusIsTrue(idTransportador);
        if (optionalTransportador.isEmpty()) {
            throw new EntityNotFoundException("Transportador não encontrado");
        }

        List<TransportadorCnpj> filiaisPage = transportadorFilialRepository.findTransportadorByTransportadorIdAndStatusIsTrue(idTransportador);

        return filiaisPage.stream()
                .map(filial -> new ResponseFilialDTO(
                        filial.getTransportadorCnpjId(),
                        filial.getNome(),
                        filial.getCnpj(),
                        filial.getTelefone(),
                        filial.getCelular(),
                        filial.getEmail(),
                        filial.getTipo().name()
                ))
                .collect(Collectors.toList());

    }

    // Buscar Transportador por ID
    public ResponseEntity<Transportador> buscarTransportadorPorId(Long id) {
        Optional<Transportador> optionalTransportador = transportadorRepository.findByIdAndStatusIsTrue(id);
        if (optionalTransportador.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(optionalTransportador.get());
    }

    // Buscar Filial de Transportador por ID
    public ResponseEntity<TransportadorCnpj> buscarTransportadorFilialPorId(Long idTransportador, Long idFilial) {
        Optional<TransportadorCnpj> optionalFilial = transportadorFilialRepository.findByIdAndStatusIsTrue(idFilial);
        if (optionalFilial.isEmpty() || !optionalFilial.get().getTransportador().getTransportadorId().equals(idTransportador)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(optionalFilial.get());
    }

    // Atualizar Transportador
    public ResponseEntity<Transportador> atualizarTransportador(CadastroTranportadorDTO cadastroDTO) {
        System.out.println("cadastroDTO = " + cadastroDTO);
        Optional<Transportador> optionalTransportador = transportadorRepository.findByIdAndStatusIsTrue(cadastroDTO.id());
        if (optionalTransportador.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Transportador transportador = optionalTransportador.get();
        transportador.setNome(cadastroDTO.nome());
        transportador.setStatus(true);
        Transportador updatedTransportador = transportadorRepository.save(transportador);
        return ResponseEntity.ok(updatedTransportador);
    }

    // Atualizar Filial de Transportador
    public ResponseEntity<TransportadorCnpj> atualizarTransportadorFilial(Long idFilial, CadastroFilialDTO cadastroDTO) {
        Optional<TransportadorCnpj> optionalFilial = transportadorFilialRepository.findById(idFilial);
        if (optionalFilial.isEmpty() ) {
            return ResponseEntity.notFound().build();
        }

        TransportadorCnpj filial = optionalFilial.get();
        changeMatriz(filial);
        filial.setNome(cadastroDTO.nome());
        filial.setCnpj(cadastroDTO.cnpj());
//        filial.setEndereco(cadastroDTO.getEndereco());
        filial.setTelefone(cadastroDTO.telefone());
        filial.setEmail(cadastroDTO.email());
        filial.setTipo(cadastroDTO.tipo());
        filial.setCelular(cadastroDTO.celular());
        // Atualizar outros campos se necessário

        TransportadorCnpj updatedFilial = transportadorFilialRepository.save(filial);
        return ResponseEntity.ok(updatedFilial);
    }

    // Deletar Transportador
    public ResponseEntity<Void> deletarTransportador(Long id) {
        Optional<Transportador> optionalTransportador = transportadorRepository.findByIdAndStatusIsTrue(id);

        if (optionalTransportador.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        optionalTransportador.get().setStatus(false);

        transportadorRepository.save(optionalTransportador.get());
        return ResponseEntity.noContent().build();
    }

    // Deletar Filial de Transportador
    public ResponseEntity<Void> deletarTransportadorFilial(  Long idFilial) {
        Optional<TransportadorCnpj> optionalFilial = transportadorFilialRepository.findByIdAndStatusIsTrue(idFilial);
        if (optionalFilial.isEmpty() ) {
            return ResponseEntity.notFound().build();
        }
        optionalFilial.get().setStatus(false);

        this.transportadorFilialRepository.save(optionalFilial.get());

        return ResponseEntity.noContent().build();
    }

    public void atualizarTipoTransportador(Long id) {
        TransportadorCnpj transportadorCnpj = transportadorFilialRepository.findByIdAndStatusIsTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("CNPJ não encontrado"));
        if(transportadorCnpj.getTipo() == FornecedorEnum.valueOf("MATRIZ")) {
            transportadorCnpj.setTipo(FornecedorEnum.valueOf("FILIAL"));
        }else {
            changeMatriz(transportadorCnpj);

            transportadorCnpj.setTipo(FornecedorEnum.valueOf("MATRIZ"));
        }
        transportadorFilialRepository.save(transportadorCnpj);
    }


    private void changeMatriz(TransportadorCnpj transportadorCnpj) {
        Optional<Transportador> transportador =
                transportadorRepository.findByIdAndStatusIsTrue(
                        transportadorCnpj
                                .getTransportador()
                                .getTransportadorId()
                );

        if(transportador.isEmpty()) {
            throw new EntityNotFoundException("Transportador não encontrado");
        }

        transportador.get().getTransportadorCnpj().forEach(transportadorCnpj1 -> {
            if(transportadorCnpj1.getTipo() == FornecedorEnum.valueOf("MATRIZ")) {
                transportadorCnpj1.setTipo(FornecedorEnum.valueOf("FILIAL"));
                this.transportadorFilialRepository.save(transportadorCnpj1);
            }
        });
    }

    public Transportador assertTransportador(Long transportadorId) throws BadRequestException {
        return transportadorRepository.findByIdAndStatusIsTrue(transportadorId).orElseThrow(() -> new BadRequestException("Transportador não encontrado"));
    }
}
