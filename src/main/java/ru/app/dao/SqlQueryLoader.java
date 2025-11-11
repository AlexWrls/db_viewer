package ru.app.dao;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class SqlQueryLoader {

    /**
     * Получает sql скрипт из ресурсов по наименованию пути до испольняемого файла
     *
     * @param path путь до sql файлв
     * @return sql скрипт
     */
    public String getQuery(String path) {
        String query = QUERIES.get(path);
        if (Objects.nonNull(query)) {
            return query;
        }
        throw new IllegalArgumentException("File not found, check the contents of the directory: "
                + SQL_RESOURCES + (path.startsWith("/") ? path : "/" + path));
    }

    private final Map<String, String> QUERIES = new ConcurrentHashMap<>();

    private static final String SQL_RESOURCES = "src/main/resources/sql";

    @PostConstruct
    private void loadAllSqlFiles() throws IOException {
        QUERIES.clear();
        Path basePath = Paths.get(SQL_RESOURCES);

        if (!Files.exists(basePath)) {
            throw new FileNotFoundException("Directory not found: " + SQL_RESOURCES);
        }

        Files.walkFileTree(basePath, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                if (file.toString().endsWith(".sql")) {
                    String content = Files.readString(file);
                    String path = basePath.relativize(file).toString();
                    QUERIES.put(path, content);
                    log.info("Add query from path: {}", path);
                }
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
                log.error("Failed to access: {}", file);
                return FileVisitResult.CONTINUE;
            }
        });

    }
}
