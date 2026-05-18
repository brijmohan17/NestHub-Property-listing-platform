package com.Nesthub.propertyList.service;

import com.Nesthub.propertyList.dto.MessageResponse;
import com.Nesthub.propertyList.dto.ReviewPayload;
import com.Nesthub.propertyList.entity.Listing;
import com.Nesthub.propertyList.entity.Review;
import com.Nesthub.propertyList.repository.ListingRepository;
import com.Nesthub.propertyList.repository.ReviewRepository;
import com.Nesthub.propertyList.security.JwtUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ListingRepository listingRepository;
    private final ReviewRepository reviewRepository;
    private final ListingPopulationService populationService;

    public Listing createReview(String listingId, ReviewPayload payload, JwtUserPrincipal principal) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));

        Review review = new Review();
        review.setComment(payload.getComment());
        review.setRating(payload.getRating());
        review.setCreatedAt(Instant.now());
        review.setAuthorId(principal.getId());
        review = reviewRepository.save(review);

        if (listing.getReviewIds() == null) {
            listing.setReviewIds(new ArrayList<>());
        }
        listing.getReviewIds().add(review.getId());
        listingRepository.save(listing);

        return populationService.populateForReviewResponse(
                listingRepository.findById(listingId).orElseThrow());
    }

    public MessageResponse deleteReview(String listingId, String reviewId, JwtUserPrincipal principal) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (review.getAuthorId() == null || !review.getAuthorId().equals(principal.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to delete this review");
        }

        Listing listing = listingRepository.findById(listingId).orElse(null);
        if (listing != null && listing.getReviewIds() != null) {
            listing.getReviewIds().remove(reviewId);
            listingRepository.save(listing);
        }
        reviewRepository.delete(review);
        return new MessageResponse("Review deleted successfully");
    }

}
