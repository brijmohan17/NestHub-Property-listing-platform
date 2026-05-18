package com.Nesthub.propertyList.dto;

import com.Nesthub.propertyList.entity.Listing;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingUpdateResponse {
    private String message;
    private Listing listing;
}
