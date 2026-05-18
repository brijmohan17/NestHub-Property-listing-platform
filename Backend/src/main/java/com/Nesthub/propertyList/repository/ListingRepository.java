package com.Nesthub.propertyList.repository;

import com.Nesthub.propertyList.entity.Listing;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ListingRepository extends MongoRepository<Listing, String> {
}
