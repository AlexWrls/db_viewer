import * as React from 'react';
import {useRef} from 'react';
import Box from '@mui/material/Box';
import {DataGrid, GridToolbarProps, Toolbar,} from '@mui/x-data-grid';
import {useDemoData} from '@mui/x-data-grid-generator';
import {Alert, Button, Typography} from "@mui/material";
import {Search} from "@mui/icons-material";
import SearchInput from "../../custom_components/SearchInput";
import {ITableDataRq, State} from "../../models/typings";

interface ChildProps {
    state: State
    onDataChange: (data: ITableDataRq) => void;
}

const DataGridTable: React.FC<ChildProps> = (data: ChildProps) => {

    const {loading} = useDemoData({
        dataSet: 'Commodity',
        rowLength: data.state.table?.rows?.length || 0,
        maxColumns: data.state.table?.headers?.length || 0,
    });

    const search = useRef<string>(data.state.rq.where || "")

    const handleClickButtonSearch = () => {
        data.onDataChange({
            tableName: data.state.rq.tableName,
            template: data.state.rq.template,
            where: search.current
        })
    };

    if (data.state.table === null) {
        return (<Alert severity='error' sx={{mt: 2}}>Ошибка загрузки таблицы</Alert>)
    }

    const columns = data.state.table.headers.map(i => ({
        field: i.columnName,
        headerName: i.columnName,
        flex: 1,
        editable: true
    }))

    const rows = data.state.table.rows.map((row, index) => {
        const obj = {id: index} as any
        columns.forEach((column, index: number) => {
            obj[column.headerName] = row[index]
        });
        return obj;
    });

    const customToolbar = (state: State): React.ComponentType<GridToolbarProps> => {
        const str: string[] = []
        state.table?.headers.forEach(i => {
            str.push(i.columnName)
        });
        const handleTestInKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleClickButtonSearch();
            }
        };
        const CustomToolbarComponent: React.FC<GridToolbarProps> = (props) => {
            return (
                <Toolbar>
                        <Typography component="div" sx={{fontSize:'middle', position:'relative'}}>
                            <span style={{
                                color: '#6e6e6e',
                                fontSize: 'small'
                            }}>select * from</span> {state.table?.name.toUpperCase()} <span
                            style={{color: '#6e6e6e', fontSize: 'small'}}>where</span>
                        </Typography>

                        <Button key="search-btn" onClick={handleClickButtonSearch}>
                            <Search/>Найти
                        </Button>
                        <SearchInput
                            onKeyPress={handleTestInKeyPress}
                            value={search.current}
                            data={str}
                            onSelect={(value) => search.current = value}
                        />
                </Toolbar>
            );
        };
        return CustomToolbarComponent;
    };

    return (
        <Box sx={{height: 'calc(100vh - 100px)', width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                density="compact"
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 100,
                        },
                    },
                }}
                loading={loading}
                slots={{toolbar: customToolbar(data.state)}}
                showToolbar
                pageSizeOptions={[100]}
                checkboxSelection
                disableRowSelectionOnClick
                sx={{
                    '& .MuiDataGrid-root': {
                        fontSize: '0.75rem', // уменьшаем размер шрифта
                    },
                    '& .MuiDataGrid-row': {
                        maxHeight: '30px !important',
                        minHeight: '30px !important',
                    },
                    '& .MuiDataGrid-cell': {
                        maxHeight: '30px !important',
                        minHeight: '30px !important',
                        lineHeight: '1.8 !important',
                        padding: '2px 2px',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        maxHeight: '35px !important',
                        minHeight: '35px !important',
                        fontSize: '0.8rem',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                    },
                }}
            />
        </Box>
    );
}
export default DataGridTable;