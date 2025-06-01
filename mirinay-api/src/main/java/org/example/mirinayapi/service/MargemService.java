package org.example.mirinayapi.service;

import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.margem.Margem;
import org.example.mirinayapi.model.margem.repositories.MargemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MargemService {

    public final MargemRepository margemRepository;

    public MargemService(MargemRepository margemRepository) {
        this.margemRepository = margemRepository;
    }

    public Margem cadastrarMargem(Margem margem) {

        return  margemRepository.save(margem);
    }

    public ResponseEntity<List<Margem>> buscarMargem() {
        return (ResponseEntity<List<Margem>>) margemRepository.findAll();
    }

    public Margem buscarMargemPorId(Long id) {
        return margemRepository.findById(id).get();
    }

    public Margem editarMargem(Margem margem) {

        Margem m = margemRepository.getReferenceById(margem.getMargemId());

        m.setNome(margem.getNome());
        m.setValorMargem(margem.getValorMargem());

        return margemRepository.save(margem);
    }

    public void excluirMarca(Long id) {

        Margem margem = margemRepository.getReferenceById(id);
        margemRepository.save(margem);
    }

    public Margem assertMargem(Long margemId) throws BadRequestException {
        Optional<Margem> margem = margemRepository.findById(margemId);
        if (margem.isEmpty()){
            throw new BadRequestException("Margem não encontrada");
        }

        return margem.get();
    }
}
