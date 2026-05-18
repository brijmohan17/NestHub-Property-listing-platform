package com.Nesthub.propertyList.controller;

import com.Nesthub.propertyList.config.SecurityContextHelper;
import com.Nesthub.propertyList.dto.MessageResponse;
import com.Nesthub.propertyList.dto.ReviewRequest;
import com.Nesthub.propertyList.entity.Listing;
import com.Nesthub.propertyList.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/listings/{id}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Listing> create(
            @PathVariable("id") String listingId, @Valid @RequestBody ReviewRequest request) {
        Listing updated = reviewService.createReview(
                listingId, request.getReview(), SecurityContextHelper.currentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<MessageResponse> destroy(
            @PathVariable("id") String listingId, @PathVariable String reviewId) {
        return ResponseEntity.ok(
                reviewService.deleteReview(listingId, reviewId, SecurityContextHelper.currentUser()));
    }
}
