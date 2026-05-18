package com.Nesthub.propertyList.service;

import com.Nesthub.propertyList.dto.ListingSearchParams;
import com.Nesthub.propertyList.dto.PagedResponse;
import com.Nesthub.propertyList.entity.Listing;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ListingSearchService {

    private final MongoTemplate mongoTemplate;

    public PagedResponse<Listing> search(ListingSearchParams params) {
        Query query = buildQuery(params);
        long total = mongoTemplate.count(query, Listing.class);

        Sort sort = resolveSort(params.getSortBy(), params.getSortDir());
        PageRequest pageable = PageRequest.of(params.getPage(), params.getSize(), sort);
        query.with(pageable);

        List<Listing> content = mongoTemplate.find(query, Listing.class);
        int totalPages = params.getSize() == 0 ? 0 : (int) Math.ceil((double) total / params.getSize());

        return PagedResponse.<Listing>builder()
                .content(content)
                .totalElements(total)
                .totalPages(totalPages)
                .page(params.getPage())
                .size(params.getSize())
                .hasNext(params.getPage() + 1 < totalPages)
                .build();
    }

    public List<String> suggestions(String q, int limit) {
        if (!StringUtils.hasText(q) || q.trim().length() < 2) {
            return List.of();
        }
        String term = escapeRegex(q.trim());
        Pattern pattern = Pattern.compile(term, Pattern.CASE_INSENSITIVE);

        Query query = new Query(new Criteria().orOperator(
                Criteria.where("title").regex(pattern),
                Criteria.where("location").regex(pattern),
                Criteria.where("country").regex(pattern)));
        query.limit(Math.min(limit, 20));

        Set<String> suggestions = new LinkedHashSet<>();
        for (Listing listing : mongoTemplate.find(query, Listing.class)) {
            if (listing.getTitle() != null && pattern.matcher(listing.getTitle()).find()) {
                suggestions.add(listing.getTitle());
            }
            if (listing.getLocation() != null && pattern.matcher(listing.getLocation()).find()) {
                suggestions.add(listing.getLocation());
            }
            if (listing.getCountry() != null && pattern.matcher(listing.getCountry()).find()) {
                suggestions.add(listing.getCountry());
            }
            if (suggestions.size() >= limit) {
                break;
            }
        }
        List<String> list = new ArrayList<>(suggestions);
        return list.subList(0, Math.min(list.size(), limit));
    }

    private Query buildQuery(ListingSearchParams params) {
        List<Criteria> andCriteria = new ArrayList<>();

        if (StringUtils.hasText(params.getQ())) {
            String term = escapeRegex(params.getQ().trim());
            Pattern pattern = Pattern.compile(term, Pattern.CASE_INSENSITIVE);
            andCriteria.add(new Criteria().orOperator(
                    Criteria.where("title").regex(pattern),
                    Criteria.where("description").regex(pattern),
                    Criteria.where("location").regex(pattern),
                    Criteria.where("country").regex(pattern)));
        }
        if (StringUtils.hasText(params.getLocation())) {
            andCriteria.add(Criteria.where("location")
                    .regex(Pattern.compile(escapeRegex(params.getLocation().trim()), Pattern.CASE_INSENSITIVE)));
        }
        if (StringUtils.hasText(params.getCountry())) {
            andCriteria.add(Criteria.where("country")
                    .regex(Pattern.compile(escapeRegex(params.getCountry().trim()), Pattern.CASE_INSENSITIVE)));
        }
        if (params.getMinPrice() != null) {
            andCriteria.add(Criteria.where("price").gte(params.getMinPrice()));
        }
        if (params.getMaxPrice() != null) {
            andCriteria.add(Criteria.where("price").lte(params.getMaxPrice()));
        }

        Query query = new Query();
        if (!andCriteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(andCriteria.toArray(new Criteria[0])));
        }
        return query;
    }

    private Sort resolveSort(String sortBy, String sortDir) {
        String field = switch (sortBy != null ? sortBy.toLowerCase() : "") {
            case "price" -> "price";
            case "title" -> "title";
            case "location" -> "location";
            case "country" -> "country";
            default -> "title";
        };
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        return Sort.by(direction, field);
    }

    private static String escapeRegex(String input) {
        return Pattern.quote(input);
    }
}
