package com.Nesthub.propertyList.repository;

import com.Nesthub.propertyList.entity.AuthProvider;
import com.Nesthub.propertyList.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByAuthProviderAndProviderId(AuthProvider authProvider, String providerId);
    boolean existsByUsername(String username);
}
