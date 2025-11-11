package ru.app.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Configuration
@ConditionalOnProperty(name = "app.swagger.enabled", havingValue = "true")
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("DB Viewer API")
                        .version("0.0.1")
                        .description("API Documentation")
                        .termsOfService("https://example.com/terms")
                        .contact(new Contact()
                                .name("Super support Team")
                                .email("support@example.com")
                                .url("https://example.com/contact")))
                .externalDocs(new ExternalDocumentation()
                        .description("More documentation")
                        .url("https://example.com/docs"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            String host = InetAddress.getLocalHost().getHostAddress();
            int port = event.getApplicationContext().getEnvironment()
                    .getProperty("server.port", Integer.class, 8080);

            System.out.println("===================== Server started =====================");
            System.out.println("URL: http://" + host + ":" + port);
            System.out.println("SWAGGER URL: http://" + host + ":" + port + "/swagger-ui/index.html");
            System.out.println("===========================================================");

        } catch (UnknownHostException e) {
            System.err.println("Unknown host: " + e.getMessage());
        }
    }
}