package com.Nesthub.propertyList.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ListingSearchParams {
    private String q;
    private String location;
    private String country;
    private Double minPrice;
    private Double maxPrice;
    private String sortBy;
    private String sortDir;
    private int page;
    private int size;
}
