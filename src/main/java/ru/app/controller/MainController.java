package ru.app.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.app.config.DbSource;
import ru.app.entity.TableData;
import ru.app.entity.TableDataRq;
import ru.app.entity.TableDataRs;
import ru.app.repository.MainRepository;

import java.util.List;

@RestController
@AllArgsConstructor
public class MainController {

    private final MainRepository repository;

    @PostMapping("/get_table_list")
    public TableDataRs<List<String>> getTableList(@RequestBody TableDataRq rq) {
        try {
            List<String> tableNames = repository.getAllTableNames(rq.getTemplate());
            return TableDataRs.<List<String>>builder().response(tableNames).build();
        } catch (Exception e) {
            return TableDataRs.<List<String>>builder().errorMessage(e.getMessage()).build();
        }
    }

    @PostMapping("/get_table_data")
    public TableDataRs<TableData> getTableData(@RequestBody TableDataRq rq) {
        try {
            TableData tableData = repository.getTableColumns(rq.getTemplate(), rq.getTableName(), rq.getWhere());
            return TableDataRs.<TableData>builder().response(tableData).build();
        } catch (Exception e) {
            return TableDataRs.<TableData>builder().errorMessage(e.getMessage()).build();
        }
    }

}
