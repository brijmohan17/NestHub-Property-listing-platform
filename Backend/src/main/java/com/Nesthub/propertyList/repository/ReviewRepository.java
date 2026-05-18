package com.Nesthub.propertyList.repository;

import com.Nesthub.propertyList.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String> {
}
