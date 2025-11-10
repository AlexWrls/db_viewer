package ru.app.entity;

import lombok.Builder;
import lombok.Getter;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Builder
@Schema(description = "Метаданные колонки таблицы")
public class TableHeader {

    @Schema(
            description = "Название колонки",
            example = "user_id",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private final String columnName;

    @Schema(
            description = "Может ли содержать NULL значения",
            example = "true",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private final boolean isNullable;

    @Schema(
            description = "Тип данных в базе данных",
            example = "VARCHAR",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private final String dataType;

    @Schema(
            description = "Максимальная длина для строковых типов",
            example = "255"
    )
    private final Integer characterMaximumLength;
}
