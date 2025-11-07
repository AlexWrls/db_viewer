package ru.app.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TableHeader {
    private final String columnName;
    private final boolean isNullable;
    private final String dataType;
    private final Integer characterMaximumLength;

}
