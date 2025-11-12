import React, {useEffect, useState} from 'react';
import {apiService} from "../../services/api";
import {
    Alert,
    Box,
    CircularProgress,
    createTheme,
    CssBaseline,
    Grid,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import CenteredTabs from "../components/CenteredTabs";
import DataGridTable from "../components/DataGridTable";
import DataGridTableMenu from "../components/DataGridTableMenu";
import {ITableDataRq, State, TemplateType} from "../../models/typings";


const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const TableView = () => {

    const [state, setState] = useState<State>({
        loading: true,
        rq: {tableName: "", template: TemplateType.FIRST},
        table: null,
        tableList: [],
        error: ''
    })

    const getTableData = (rq: ITableDataRq) => {
        apiService.findTableRows(rq).then(rs => {
            if (rs.data.errorMessage) {
                setState(prev => ({
                    ...prev,
                    error: rs.data.errorMessage
                }))
            } else {
                setState(prev => ({
                    ...prev,
                    rq: rq,
                    table: rs.data.response,
                    error: ''
                }))
            }

        }).catch(err => {
            console.log(err)
        })
    }

    const changeTemplate = (rq: ITableDataRq) => {
        apiService.findAllTableName(rq).then(rs => {
            if (rs.data.errorMessage) {
                setState(prev => ({
                    ...prev,
                    error: rs.data.errorMessage
                }))
            } else {
                setState(prev => ({
                    ...prev,
                    table: null,
                    rq: rq,
                    tableList: rs.data.response,
                    error: '',
                    loading: false
                }))
            }

        })
    }

    useEffect(() => {
        apiService.findAllTableName(state.rq).then(rs => {
            console.log(`rs=${JSON.stringify(rs.data,null,2)}`)
            if (rs.data.errorMessage) {
                setState(prev => ({
                    ...prev,
                    error: rs.data.errorMessage
                }))
            } else {
                setState(prev => ({
                    ...prev,
                    tableList: rs.data.response,
                    error: '',
                    loading: false
                }))
            }
        })
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    <CenteredTabs state={state} onDataChange={changeTemplate}/>
                </Typography>
            </Toolbar>
            <Box sx={{flexGrow: 1, mt: 1, mb: 1}}>
                <Grid container spacing={2}>
                    <Grid size={10}>
                        {state.loading &&
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                <CircularProgress/>
                            </Box>}
                        {state.table &&
                            <DataGridTable state={state} onDataChange={getTableData}/>
                        }
                    </Grid>
                    <Grid size={2}>
                        <DataGridTableMenu state={state} onDataChange={getTableData}/>
                    </Grid>
                </Grid>
            </Box>
            {state.error && (
                <Alert
                    severity={'error'}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        zIndex: 9999
                    }}
                >
                    {state.error}
                </Alert>
            )}
        </ThemeProvider>
    );
};

export default TableView;