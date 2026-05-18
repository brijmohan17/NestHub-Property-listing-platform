package com.Nesthub.propertyList.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {

    @Id
    @JsonProperty("_id")
    private String id;

    @Indexed(unique = true, sparse = true)
    private String email;

    private String username;

    @JsonIgnore
    private String password;

    private AuthProvider authProvider = AuthProvider.LOCAL;

    /** Provider subject id (Google sub, GitHub id). */
    @Indexed(sparse = true)
    private String providerId;

    private String imageUrl;
}
