package ru.app.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TableDataRs<T> {
    private String errorMessage;
    private T response;
}
