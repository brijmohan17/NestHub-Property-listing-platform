package com.Nesthub.propertyList.config;

import com.Nesthub.propertyList.security.JwtUserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityContextHelper {

    private SecurityContextHelper() {
    }

    public static boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getPrincipal() instanceof JwtUserPrincipal;
    }

    public static JwtUserPrincipal currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof JwtUserPrincipal principal)) {
            throw new IllegalStateException("Unauthenticated");
        }
        return principal;
    }
}
