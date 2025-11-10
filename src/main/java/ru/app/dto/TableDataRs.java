package ru.app.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import ru.app.entity.TableData;

import java.util.List;

@Getter
@Builder
@Schema(description = "Универсальный response DTO для операций с данными таблиц")
public class TableDataRs<T> {

    @Schema(
            description = "Текст ошибки, если операция завершилась неудачно",
            example = "Ошибка доступа к таблице: недостаточно прав",
            nullable = true)
    private final String errorMessage;

    @Schema(
            description = "Успешный response с данными",
            requiredMode = Schema.RequiredMode.REQUIRED,
            oneOf = {TableData.class, List.class, String.class})
    private final T response;
}