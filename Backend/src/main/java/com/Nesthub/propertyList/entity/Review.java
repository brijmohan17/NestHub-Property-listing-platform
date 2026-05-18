package com.Nesthub.propertyList.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    @JsonProperty("_id")
    private String id;

    private String comment;
    private Integer rating;
    private Instant createdAt;

    @Field("author")
    @JsonIgnore
    private String authorId;

    @Transient
    @JsonProperty("author")
    private User author;
}
