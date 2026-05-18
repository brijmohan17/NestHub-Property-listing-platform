package com.Nesthub.propertyList.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "listings")
public class Listing {

    @Id
    @JsonProperty("_id")
    private String id;

    private String title;
    private String description;
    private ImageEmbed image;
    private Double price;
    private String location;
    private String country;

    @Field("review")
    @JsonIgnore
    private List<String> reviewIds = new ArrayList<>();

    @Field("owner")
    @JsonIgnore
    private String ownerId;

    @Transient
    @JsonProperty("review")
    private List<Review> review = new ArrayList<>();

    @Transient
    @JsonProperty("owner")
    private User owner;
}
