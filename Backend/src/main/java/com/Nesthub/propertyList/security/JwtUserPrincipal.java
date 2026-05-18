package com.Nesthub.propertyList.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtUserPrincipal {
    private final String id;
    private final String email;
    private final String username;
}
