package ru.app.repository;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.app.config.DbSource;
import ru.app.entity.TableData;
import ru.app.entity.TableHeader;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Repository
@Transactional
public class MainRepository {

    private static final String YES = "YES";
    private static final int ROWS_LIMIT = 500;

    /**
     * Получает список названий всех таблиц в указанной схеме.
     *
     * @param source источник БД
     * @return Список наименований таблиц в схеме источника (List<String>)
     */
    public List<String> getAllTableNames(DbSource source) {
        String sql = "SELECT table_name FROM information_schema.tables " +
                "WHERE table_schema = :schema AND table_type = 'BASE TABLE'";
        Map<String, Object> params = Map.of("schema", source.getSchemaName());
        return source.getTemplate().queryForList(sql, params, String.class);
    }

    /**
     * Получает имена и типы столбцов для конкретной таблицы.
     *
     * @param source    источник БД
     * @param tableName название таблицы
     * @param where     дополнительное условие для поиска
     * @return заголовки и данне таблцы
     */
    public TableData getTableColumns(DbSource source, String tableName, String where) {
        String headerInfoSql = "SELECT column_name, is_nullable , data_type, character_maximum_length " +
                "FROM information_schema.columns " +
                "WHERE table_schema = :schema AND table_name = :table " +
                "ORDER BY ordinal_position";

        Map<String, Object> params = Map.of(
                "schema", source.getSchemaName(),
                "table", tableName);

        List<TableHeader> headers = source.getTemplate().query(headerInfoSql, params, this::mapTableHeadersRow);

        where = Objects.nonNull(where) && !where.isEmpty() ? " where " + where : "";
        String dataTableSql = String.format("SELECT * from %s.%s%s limit %s", source.getSchemaName(), tableName, where, ROWS_LIMIT);

        List<List<String>> rows = source.getTemplate().query(dataTableSql, Map.of("table", tableName), (rs, row) -> {
            List<String> item = new ArrayList<>();
            for (TableHeader tHeader : headers) {
                String value = rs.getString(tHeader.getColumnName());
                item.add(value);
            }
            return item;
        });
        return TableData.builder()
                .name(tableName)
                .headers(headers)
                .rows(rows)
                .build();
    }


    private TableHeader mapTableHeadersRow(ResultSet rs, int rowNum) {
        try {
            return TableHeader.builder()
                    .columnName(rs.getString("column_name"))
                    .isNullable(YES.equalsIgnoreCase(rs.getString("is_nullable")))
                    .dataType(rs.getString("data_type"))
                    .characterMaximumLength(rs.getInt("character_maximum_length"))
                    .build();
        } catch (SQLException e) {
            throw new IllegalArgumentException(e);
        }
    }

}
