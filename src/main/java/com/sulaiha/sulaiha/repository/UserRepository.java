package com.sulaiha.sulaiha.repository;

import com.sulaiha.sulaiha.entity.Role;
import com.sulaiha.sulaiha.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleOrderByIdDesc(Role role);
}
