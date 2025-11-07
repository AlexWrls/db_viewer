package ru.app.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

@Configuration
public class DbSourceConfig {

    @Autowired
    @Qualifier("firstJdbcTemplate")
    private NamedParameterJdbcTemplate firstJdbcTemplate;

    @Autowired
    @Qualifier("secondJdbcTemplate")
    private NamedParameterJdbcTemplate secondJdbcTemplate;

    @Autowired
    @Qualifier("thirdJdbcTemplate")
    private NamedParameterJdbcTemplate thirdJdbcTemplate;


    @PostConstruct
    public void init() {
        DbSource.FIRST.setTemplate(firstJdbcTemplate);
        DbSource.SECOND.setTemplate(secondJdbcTemplate);
        DbSource.THIRD.setTemplate(thirdJdbcTemplate);
    }
}
