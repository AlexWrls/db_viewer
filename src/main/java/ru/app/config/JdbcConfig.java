package ru.app.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;


@Configuration
public class JdbcConfig {

//---------------- first ----------------
    @Bean
    @ConfigurationProperties("first.datasource")
    public DataSourceProperties firstDatasourceProps() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource firstDataSource() {
        return firstDatasourceProps().initializeDataSourceBuilder().build();
    }

    @Bean
    @Primary
    public NamedParameterJdbcTemplate firstJdbcTemplate() {
        return new NamedParameterJdbcTemplate(firstDataSource());
    }


//---------------- second ----------------
    @Bean
    @ConfigurationProperties("second.datasource")
    public DataSourceProperties secondDatasourceProps() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource secondDataSource() {
         return secondDatasourceProps().initializeDataSourceBuilder().build();
    }

    @Bean
    public NamedParameterJdbcTemplate secondJdbcTemplate() {
        return new NamedParameterJdbcTemplate(secondDataSource());
    }

    //---------------- third ----------------
    @Bean
    @ConfigurationProperties("third.datasource")
    public DataSourceProperties thirdDatasourceProps() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource thirdDataSource() {
        return secondDatasourceProps().initializeDataSourceBuilder().build();
    }

    @Bean
    public NamedParameterJdbcTemplate thirdJdbcTemplate() {
        return new NamedParameterJdbcTemplate(secondDataSource());
    }

}