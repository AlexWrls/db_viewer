package ru.app.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;


@Getter
@Builder
@Schema(description = "Объект таблицы с данными")
public class TableData {
    @Schema(
            description = "Название таблицы",
            example = "users",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private final String name;
    @Schema(
            description = "Заголовки таблицы (колонки)",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private List<TableHeader> headers;
    @Schema(
            description = "Строки данных таблицы",
            example = "[[\"1\", \"John\", \"john@example.com\"], [\"2\", \"Jane\", \"jane@example.com\"]]",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private List<List<String>> rows;
}