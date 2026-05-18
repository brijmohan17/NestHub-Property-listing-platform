package com.Nesthub.propertyList.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class OAuth2ClientConfig {

    @Value("${GOOGLE_CLIENT_ID:}")
    private String googleClientId;

    @Value("${GOOGLE_CLIENT_SECRET:}")
    private String googleClientSecret;

    @Value("${GITHUB_CLIENT_ID:}")
    private String githubClientId;

    @Value("${GITHUB_CLIENT_SECRET:}")
    private String githubClientSecret;

    @Bean
    public OAuth2ProviderRegistry oauth2ProviderRegistry() {
        List<String> providers = new ArrayList<>();
        if (StringUtils.hasText(googleClientId) && StringUtils.hasText(googleClientSecret)) {
            providers.add("google");
        }
        if (StringUtils.hasText(githubClientId) && StringUtils.hasText(githubClientSecret)) {
            providers.add("github");
        }
        return new OAuth2ProviderRegistry(providers);
    }

    @Bean
    @ConditionalOnExpression("@oauth2ProviderRegistry.isEnabled()")
    public ClientRegistrationRepository clientRegistrationRepository(OAuth2ProviderRegistry registry) {
        List<ClientRegistration> registrations = new ArrayList<>();
        if (registry.providers().contains("google")) {
            registrations.add(googleRegistration(googleClientId, googleClientSecret));
        }
        if (registry.providers().contains("github")) {
            registrations.add(githubRegistration(githubClientId, githubClientSecret));
        }
        return new InMemoryClientRegistrationRepository(registrations);
    }

    private static ClientRegistration googleRegistration(String clientId, String clientSecret) {
        return ClientRegistration.withRegistrationId("google")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("openid", "profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://oauth2.googleapis.com/token")
                .userInfoUri("https://openidconnect.googleapis.com/v1/userinfo")
                .userNameAttributeName("sub")
                .clientName("Google")
                .build();
    }

    private static ClientRegistration githubRegistration(String clientId, String clientSecret) {
        return ClientRegistration.withRegistrationId("github")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("read:user", "user:email")
                .authorizationUri("https://github.com/login/oauth/authorize")
                .tokenUri("https://github.com/login/oauth/access_token")
                .userInfoUri("https://api.github.com/user")
                .userNameAttributeName("id")
                .clientName("GitHub")
                .build();
    }

    public record OAuth2ProviderRegistry(List<String> providers) {
        public boolean isEnabled() {
            return providers != null && !providers.isEmpty();
        }
    }
}
