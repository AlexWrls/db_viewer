import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { Button } from "@mui/material";
import { ITableDataRq, State } from "../../models/typings";

interface ChildProps {
    state: State
    onDataChange: (data: ITableDataRq) => void;
}

const DataGridTableMenu: React.FC<ChildProps> = (props: ChildProps) => {
    const handleAction = (params: GridRenderCellParams) => {
        props.onDataChange({ tableName: params.row.tables, template: props.state.rq.template })
    };

    const isSelected = (tableName: string) => {
        return props.state.rq.tableName === tableName;
    };

    const columns = [{
        field: 'tables',
        headerName: 'Tables',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
            const selected = isSelected(params.row.tables);
            return (
                <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => handleAction(params)}
                    sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: '100%',
                        maxHeight: '100%',
                        borderRadius: 0,
                        backgroundColor: selected ? 'primary.main' : 'white',
                        color: selected ? 'white' : 'text.primary',
                        border: selected ? 'none' : '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            backgroundColor: selected ? 'primary.dark' : 'grey.100',
                        },
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: selected ? 'bold' : 'normal',
                    }}
                >
                    {params.row.tables}
                </Button>
            )
        }
    }]

    const rows = props.state.tableList.map((row, index) => {
        const obj = { id: index } as any
        obj['tables'] = row
        return obj;
    });

    const { loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: rows.length,
        maxColumns: columns.length,
    });

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                density="compact"
                loading={loading}
                showToolbar
                sx={{
                    '& .MuiDataGrid-root': {
                        fontSize: '0.75rem',
                    },
                    '& .MuiDataGrid-row': {
                        maxHeight: '30px !important',
                        minHeight: '30px !important',
                    },
                    '& .MuiDataGrid-cell': {
                        maxHeight: '30px !important',
                        minHeight: '30px !important',
                        lineHeight: '1.8 !important',
                        padding: '0px !important',
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
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-cell:focus-within': {
                        outline: 'none',
                    },
                }}
            />
        </Box>
    );
}
export default DataGridTableMenu;