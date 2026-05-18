package com.Nesthub.propertyList.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ListingPayload {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Country is required")
    private String country;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0", message = "Price cannot be negative")
    private Double price;
}
