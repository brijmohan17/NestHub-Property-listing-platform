package com.Nesthub.propertyList.service;

import com.Nesthub.propertyList.dto.ListingCreateResponse;
import com.Nesthub.propertyList.dto.ListingPayload;
import com.Nesthub.propertyList.dto.ListingUpdateResponse;
import com.Nesthub.propertyList.dto.MessageResponse;
import com.Nesthub.propertyList.entity.ImageEmbed;
import com.Nesthub.propertyList.entity.Listing;
import com.Nesthub.propertyList.repository.ListingRepository;
import com.Nesthub.propertyList.repository.ReviewRepository;
import com.Nesthub.propertyList.security.JwtUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final ReviewRepository reviewRepository;
    private final CloudinaryService cloudinaryService;
    private final ListingPopulationService populationService;

    public List<Listing> findAll() {
        return listingRepository.findAll();
    }

    public Listing findById(String id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));
        return populationService.populateForShow(listing);
    }

    public ListingCreateResponse create(ListingPayload payload, MultipartFile image, JwtUserPrincipal principal) {
        if (image == null || image.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required.");
        }
        try {
            ImageEmbed uploaded = cloudinaryService.upload(image);
            Listing listing = new Listing();
            applyPayload(listing, payload);
            listing.setOwnerId(principal.getId());
            listing.setImage(uploaded);
            listing = listingRepository.save(listing);
            return new ListingCreateResponse("Listing created successfully!", listing);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error");
        }
    }

    public ListingUpdateResponse update(
            String id, ListingPayload payload, MultipartFile image, JwtUserPrincipal principal) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "listing not found"));
        assertOwner(listing, principal);

        applyPayload(listing, payload);
        if (image != null && !image.isEmpty()) {
            try {
                listing.setImage(cloudinaryService.upload(image));
            } catch (IOException ex) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update listing");
            }
        }
        listing = listingRepository.save(listing);
        return new ListingUpdateResponse("Listing updated successfully", listing);
    }

    public MessageResponse delete(String id, JwtUserPrincipal principal) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));
        assertOwner(listing, principal);

        if (listing.getReviewIds() != null && !listing.getReviewIds().isEmpty()) {
            reviewRepository.deleteAllById(listing.getReviewIds());
        }
        listingRepository.delete(listing);
        return new MessageResponse("Listing deleted successfully");
    }

    public void assertOwner(Listing listing, JwtUserPrincipal principal) {
        if (listing.getOwnerId() == null || !listing.getOwnerId().equals(principal.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "You are not authorized to delete this listing");
        }
    }

    private void applyPayload(Listing listing, ListingPayload payload) {
        listing.setTitle(payload.getTitle());
        listing.setDescription(payload.getDescription());
        listing.setLocation(payload.getLocation());
        listing.setCountry(payload.getCountry());
        listing.setPrice(payload.getPrice());
    }
}
