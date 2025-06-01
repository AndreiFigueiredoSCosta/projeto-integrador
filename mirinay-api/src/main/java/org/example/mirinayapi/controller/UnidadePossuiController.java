package org.example.mirinayapi.controller;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.unidadePossui.UnidadePossui;
import org.example.mirinayapi.model.unidadePossui.dto.CadastroPossuiDTO;
import org.example.mirinayapi.service.UnidadePossuiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/unidadePossui")
public class UnidadePossuiController {
    private final UnidadePossuiService unidadePossuiService;

    @PostMapping
    public ResponseEntity<UnidadePossui> save(@RequestBody CadastroPossuiDTO unidadePossui) {
        return ResponseEntity.ok(unidadePossuiService.save(unidadePossui));
    }

    @GetMapping
    public ResponseEntity<List<UnidadePossui>> findAll() {
        return ResponseEntity.ok(unidadePossuiService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadePossui> findById(@PathVariable Long id) {
        return ResponseEntity.ok(unidadePossuiService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnidadePossui> update(@PathVariable Long id, @RequestBody UnidadePossui unidadePossui) {
        return ResponseEntity.ok(unidadePossuiService.update(id, unidadePossui));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        unidadePossuiService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
