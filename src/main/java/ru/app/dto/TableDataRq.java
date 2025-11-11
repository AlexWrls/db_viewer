package ru.app.dto;


import lombok.Data;
import ru.app.config.DbSource;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request объект для операций с таблицами")
public class TableDataRq {
   @Schema(
           description = "Наименование таблицы",
           example = "users",
           requiredMode = Schema.RequiredMode.REQUIRED)
   private String tableName;
   @Schema(
           description = "Источник данных (база данных)",
           requiredMode = Schema.RequiredMode.REQUIRED)
   private DbSource template;
   @Schema(
           description = "Условие WHERE для фильтрации данных",
           example = "age > 18 AND status = 'active'",
           nullable = true)
   private String where;
}