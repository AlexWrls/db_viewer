package repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import ru.app.config.DbSource;
import ru.app.entity.TableData;
import ru.app.entity.TableHeader;
import ru.app.repository.MainRepository;

import java.sql.ResultSet;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class MainRepositoryTest {

    @Mock
    private DbSource dbSource;

    @Mock
    private NamedParameterJdbcTemplate jdbcTemplate;

    @Mock
    private ResultSet resultSet;

    private MainRepository mainRepository;

    @BeforeEach
    void setUp() {
        mainRepository = new MainRepository();
        when(dbSource.getTemplate()).thenReturn(jdbcTemplate);
    }

    @Test
    void getAllTableNames_ShouldReturnTableNames() {
        // Arrange
        String schemaName = "public";
        List<String> expectedTables = Arrays.asList("users", "products", "orders");

        when(dbSource.getSchemaName()).thenReturn(schemaName);
        when(jdbcTemplate.queryForList(anyString(), any(Map.class), eq(String.class)))
                .thenReturn(expectedTables);

        // Act
        List<String> result = mainRepository.getAllTableNames(dbSource);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(expectedTables, result);

        verify(dbSource).getSchemaName();
        verify(jdbcTemplate).queryForList(
                eq("SELECT table_name FROM information_schema.tables WHERE table_schema = :schema AND table_type = 'BASE TABLE'"),
                eq(Map.of("schema", schemaName)),
                eq(String.class)
        );
    }

    @Test
    void getTableColumns_WithoutWhereClause_ShouldReturnTableData() {
        // Arrange
        String schemaName = "public";
        String tableName = "users";

        when(dbSource.getSchemaName()).thenReturn(schemaName);

        List<TableHeader> mockHeaders = Arrays.asList(
                TableHeader.builder()
                        .columnName("id")
                        .dataType("integer")
                        .isNullable(false)
                        .characterMaximumLength(0)
                        .build(),
                TableHeader.builder()
                        .columnName("name")
                        .dataType("varchar")
                        .isNullable(true)
                        .characterMaximumLength(100)
                        .build()
        );

        List<List<String>> mockRows = Arrays.asList(
                Arrays.asList("1", "John Doe"),
                Arrays.asList("2", "Jane Smith")
        );

        // Mock первый вызов query (для заголовков)
        when(jdbcTemplate.query(
                eq("SELECT column_name, is_nullable , data_type, character_maximum_length FROM information_schema.columns WHERE table_schema = :schema AND table_name = :table ORDER BY ordinal_position"),
                eq(Map.of("schema", schemaName, "table", tableName)),
                any(RowMapper.class))
        ).thenReturn(mockHeaders);

        // Mock второй вызов query (для данных)
        when(jdbcTemplate.query(
                eq("SELECT * from public.users limit 500"),
                eq(Map.of("table", tableName)),
                any(RowMapper.class))
        ).thenReturn(mockRows);

        // Act
        TableData result = mainRepository.getTableColumns(dbSource, tableName, null);

        // Assert
        assertNotNull(result);
        assertEquals(tableName, result.getName());
        assertEquals(2, result.getHeaders().size());
        assertEquals(2, result.getRows().size());
        assertEquals("id", result.getHeaders().get(0).getColumnName());
        assertEquals("name", result.getHeaders().get(1).getColumnName());
    }

    @Test
    void getTableColumns_WithWhereClause_ShouldReturnFilteredTableData() {
        // Arrange
        String schemaName = "public";
        String tableName = "users";
        String whereClause = "age > 18";

        when(dbSource.getSchemaName()).thenReturn(schemaName);

        List<TableHeader> mockHeaders = Arrays.asList(
                TableHeader.builder()
                        .columnName("id")
                        .dataType("integer")
                        .isNullable(false)
                        .characterMaximumLength(0)
                        .build()
        );

        List<List<String>> mockRows = Arrays.asList(
                Arrays.asList("1"),
                Arrays.asList("2")
        );

        when(jdbcTemplate.query(
                eq("SELECT column_name, is_nullable , data_type, character_maximum_length FROM information_schema.columns WHERE table_schema = :schema AND table_name = :table ORDER BY ordinal_position"),
                eq(Map.of("schema", schemaName, "table", tableName)),
                any(RowMapper.class))
        ).thenReturn(mockHeaders);

        when(jdbcTemplate.query(
                eq("SELECT * from public.users where age > 18 limit 500"),
                eq(Map.of("table", tableName)),
                any(RowMapper.class))
        ).thenReturn(mockRows);

        // Act
        TableData result = mainRepository.getTableColumns(dbSource, tableName, whereClause);

        // Assert
        assertNotNull(result);
        assertEquals(tableName, result.getName());
        assertEquals(1, result.getHeaders().size());
        assertEquals(2, result.getRows().size());
    }

    @Test
    void getTableColumns_WithEmptyWhereClause_ShouldReturnAllData() {
        // Arrange
        String schemaName = "public";
        String tableName = "users";
        String whereClause = "";

        when(dbSource.getSchemaName()).thenReturn(schemaName);

        List<TableHeader> mockHeaders = Arrays.asList(
                TableHeader.builder()
                        .columnName("id")
                        .dataType("integer")
                        .isNullable(false)
                        .characterMaximumLength(0)
                        .build()
        );

        List<List<String>> mockRows = Arrays.asList(Arrays.asList("1"));

        when(jdbcTemplate.query(
                eq("SELECT column_name, is_nullable , data_type, character_maximum_length FROM information_schema.columns WHERE table_schema = :schema AND table_name = :table ORDER BY ordinal_position"),
                eq(Map.of("schema", schemaName, "table", tableName)),
                any(RowMapper.class))
        ).thenReturn(mockHeaders);

        when(jdbcTemplate.query(
                eq("SELECT * from public.users limit 500"),
                eq(Map.of("table", tableName)),
                any(RowMapper.class))
        ).thenReturn(mockRows);

        // Act
        TableData result = mainRepository.getTableColumns(dbSource, tableName, whereClause);

        // Assert
        assertNotNull(result);
        assertEquals(tableName, result.getName());
    }

}