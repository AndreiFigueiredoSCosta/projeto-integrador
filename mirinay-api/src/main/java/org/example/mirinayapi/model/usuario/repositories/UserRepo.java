package org.example.mirinayapi.model.usuario.repositories;

import org.example.mirinayapi.model.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
