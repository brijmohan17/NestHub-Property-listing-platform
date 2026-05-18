package com.Nesthub.propertyList.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class AppProperties {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;
}
