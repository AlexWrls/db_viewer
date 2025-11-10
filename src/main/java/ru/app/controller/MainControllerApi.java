package ru.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.app.entity.TableData;
import ru.app.dto.TableDataRq;
import ru.app.dto.TableDataRs;

import java.util.List;


@RequestMapping("/api")
@Tag(name = "MainControllerApi", description = "Основной rest контроллер взаимодействия между клиентом и сервером БД")
public interface MainControllerApi {


    @PostMapping("/find_all_table_name")
    @Operation(summary = "Формирует спискок наимонований таблиц БД")
    TableDataRs<List<String>> findAllTableName(@RequestBody TableDataRq rq);


    @PostMapping("/find_table_rows")
    @Operation(summary = "Формирует объект таблицы залоговки и ее данные")
    TableDataRs<TableData> findTableRows(@RequestBody TableDataRq rq);
}
