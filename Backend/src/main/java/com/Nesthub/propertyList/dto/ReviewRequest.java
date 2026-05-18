package com.Nesthub.propertyList.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull
    @Valid
    private ReviewPayload review;
}
