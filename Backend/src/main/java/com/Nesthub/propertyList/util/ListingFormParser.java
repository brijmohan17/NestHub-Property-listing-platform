package com.Nesthub.propertyList.util;

import com.Nesthub.propertyList.dto.ListingPayload;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.Map;

public final class ListingFormParser {

    private ListingFormParser() {
    }

    public static ListingPayload parsePayload(Map<String, String> params) {
        ListingPayload payload = new ListingPayload();
        payload.setTitle(params.get("listing[title]"));
        payload.setDescription(params.get("listing[description]"));
        payload.setLocation(params.get("listing[location]"));
        payload.setCountry(params.get("listing[country]"));
        String price = params.get("listing[price]");
        if (price != null && !price.isBlank()) {
            payload.setPrice(Double.parseDouble(price));
        }
        return payload;
    }

    public static MultipartFile parseImage(MultipartHttpServletRequest request) {
        MultipartFile file = request.getFile("listing[image]");
        if (file != null) {
            return file;
        }
        return request.getFile("listing.image");
    }
}
