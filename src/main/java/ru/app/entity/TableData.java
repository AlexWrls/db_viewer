package ru.app.entity;

import lombok.Builder;
import lombok.Getter;

import java.util.List;


@Getter
@Builder
public class TableData {
    private final String name;
    private List<TableHeader> headers;
    private List<List<String>> rows;
}
