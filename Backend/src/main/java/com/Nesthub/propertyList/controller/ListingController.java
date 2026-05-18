package com.Nesthub.propertyList.controller;

import com.Nesthub.propertyList.config.SecurityContextHelper;
import com.Nesthub.propertyList.dto.ListingCreateResponse;
import com.Nesthub.propertyList.dto.ListingPayload;
import com.Nesthub.propertyList.dto.ListingSearchParams;
import com.Nesthub.propertyList.dto.ListingUpdateResponse;
import com.Nesthub.propertyList.dto.MessageResponse;
import com.Nesthub.propertyList.dto.PagedResponse;
import com.Nesthub.propertyList.entity.Listing;
import com.Nesthub.propertyList.service.ListingSearchService;
import com.Nesthub.propertyList.service.ListingService;
import com.Nesthub.propertyList.util.ListingFormParser;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;
    private final ListingSearchService listingSearchService;
    private final Validator validator;

    @GetMapping
    public ResponseEntity<List<Listing>> index() {
        return ResponseEntity.ok(listingService.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<Listing>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        ListingSearchParams params = ListingSearchParams.builder()
                .q(q)
                .location(location)
                .country(country)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .sortBy(sortBy)
                .sortDir(sortDir)
                .page(Math.max(page, 0))
                .size(Math.min(Math.max(size, 1), 50))
                .build();
        return ResponseEntity.ok(listingSearchService.search(params));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> suggestions(
            @RequestParam String q,
            @RequestParam(defaultValue = "8") int limit) {
        return ResponseEntity.ok(listingSearchService.suggestions(q, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Listing> show(@PathVariable String id) {
        return ResponseEntity.ok(listingService.findById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListingCreateResponse> create(MultipartHttpServletRequest request) {
        ListingPayload payload = ListingFormParser.parsePayload(request.getParameterMap()
                .entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue()[0])));
        validateListing(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(listingService.create(
                        payload,
                        ListingFormParser.parseImage(request),
                        SecurityContextHelper.currentUser()));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListingUpdateResponse> update(
            @PathVariable String id, MultipartHttpServletRequest request) {
        ListingPayload payload = ListingFormParser.parsePayload(request.getParameterMap()
                .entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue()[0])));
        validateListing(payload);
        return ResponseEntity.ok(listingService.update(
                id,
                payload,
                ListingFormParser.parseImage(request),
                SecurityContextHelper.currentUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> destroy(@PathVariable String id) {
        return ResponseEntity.ok(listingService.delete(id, SecurityContextHelper.currentUser()));
    }

    private void validateListing(ListingPayload payload) {
        var violations = validator.validate(payload);
        if (!violations.isEmpty()) {
            String msg = violations.stream()
                    .map(v -> v.getMessage())
                    .collect(Collectors.joining(","));
            throw new IllegalArgumentException("Validation Error : " + msg);
        }
    }
}
