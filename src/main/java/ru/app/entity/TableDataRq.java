package ru.app.entity;


import lombok.Data;
import ru.app.config.DbSource;

@Data
public class TableDataRq {
   private String tableName;
   private DbSource template;
   private String where;
}
