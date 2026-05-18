package com.Nesthub.propertyList.service;

import com.Nesthub.propertyList.entity.Listing;
import com.Nesthub.propertyList.entity.Review;
import com.Nesthub.propertyList.entity.User;
import com.Nesthub.propertyList.repository.ReviewRepository;
import com.Nesthub.propertyList.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ListingPopulationService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public void populateOwner(Listing listing) {
        if (listing.getOwnerId() != null) {
            userRepository.findById(listing.getOwnerId()).ifPresent(listing::setOwner);
        }
    }

    public void populateReviews(Listing listing, boolean authorUsernameOnly) {
        List<Review> reviews = new ArrayList<>();
        if (listing.getReviewIds() != null) {
            for (String reviewId : listing.getReviewIds()) {
                reviewRepository.findById(reviewId).ifPresent(review -> {
                    if (review.getAuthorId() != null) {
                        Optional<User> author = userRepository.findById(review.getAuthorId());
                        author.ifPresent(user -> {
                            if (authorUsernameOnly) {
                                User summary = new User();
                                summary.setId(user.getId());
                                summary.setUsername(user.getUsername());
                                review.setAuthor(summary);
                            } else {
                                review.setAuthor(user);
                            }
                        });
                    }
                    reviews.add(review);
                });
            }
        }
        listing.setReview(reviews);
    }

    public Listing populateForShow(Listing listing) {
        populateOwner(listing);
        populateReviews(listing, true);
        return listing;
    }

    public Listing populateForReviewResponse(Listing listing) {
        populateOwner(listing);
        populateReviews(listing, false);
        return listing;
    }
}
