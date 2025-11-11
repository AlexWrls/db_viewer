package ru.app.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.app.entity.TableData;
import ru.app.dto.TableDataRq;
import ru.app.dto.TableDataRs;
import ru.app.repository.MainRepository;

import java.util.List;


@RestController
@AllArgsConstructor
public class MainController implements MainControllerApi {
    private final MainRepository repository;
    @Override
    public TableDataRs<List<String>> findAllTableName(@RequestBody TableDataRq rq) {
        try {
            List<String> tableNames = repository.findAllTableName(rq.getTemplate());
            return TableDataRs.<List<String>>builder().response(tableNames).build();
        } catch (Exception e) {
            return TableDataRs.<List<String>>builder().errorMessage(e.getMessage()).build();
        }
    }
    @Override
    public TableDataRs<TableData> findTableRows(@RequestBody TableDataRq rq) {
        try {
            TableData tableData = repository.findTableRows(rq.getTemplate(), rq.getTableName(), rq.getWhere());
            return TableDataRs.<TableData>builder().response(tableData).build();
        } catch (Exception e) {
            return TableDataRs.<TableData>builder().errorMessage(e.getMessage()).build();
        }
    }

}
