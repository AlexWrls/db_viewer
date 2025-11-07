package ru.app.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

public enum DbSource {

    FIRST("first"),
    SECOND("second"),
    THIRD("public");
    @Getter
    @Setter
    private NamedParameterJdbcTemplate template;
    @Getter
    private final String schemaName;

    DbSource(String schemaName) {
        this.schemaName = schemaName;
    }

    public static DbSource lookup(String value) {
        for (DbSource source : values()) {
            if (source.name().equals(value)) {
                return source;
            }
        }
        throw new IllegalArgumentException("Unknown data source: " + value);
    }
}