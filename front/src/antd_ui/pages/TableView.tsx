import React, {useEffect, useState} from 'react';
import {apiService} from "../../services/api";
import CenteredTabs from "../components/CenteredTabs";
import {Alert, Card, Col, ConfigProvider, Layout, Row, Spin, Typography} from "antd";
import {ITableDataRq, State, TemplateType} from "../../models/typings";
import DataGridTable from "../components/DataGridTable";
import DataGridTableMenu from "../components/DataGridTableMenu";


const theme = { token: {},};

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
        <ConfigProvider theme={theme}>
            <Layout style={{ height: '98vh' }}>
                <Layout.Header style={{ backgroundColor: "white" }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                    }}>
                        <Typography.Title
                            level={4}
                            style={{
                                flex: 1,
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <CenteredTabs state={state} onDataChange={changeTemplate}/>
                        </Typography.Title>
                    </div>
                </Layout.Header>

                <Layout.Content style={{
                    padding: '8px 0',
                    height: 'calc(980vh - 64px)',
                    overflow: 'hidden'
                }}>
                    <Row gutter={[16, 16]} style={{
                        height: '100%',
                        margin: 0
                    }}>
                        {state.error && (
                            <Col span={24}>
                                <Alert
                                    message="Error"
                                    description={state.error}
                                    type="error"
                                    showIcon
                                    style={{ marginTop: 16 }}
                                />
                            </Col>
                        )}

                        <Col span={20} style={{
                            height: '100%',
                            padding: 0
                        }}>
                            {state.loading && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%'
                                }}>
                                    <Spin size="large"/>
                                </div>
                            )}
                            {state.table && (
                                <div style={{ height: '100%' }}>
                                    <DataGridTable state={state} onDataChange={getTableData}/>
                                </div>
                            )}
                        </Col>

                        <Col span={4} style={{ padding: 0 }}>
                            <Card size="small" style={{ height: '100%' }}>
                                <DataGridTableMenu state={state} onDataChange={getTableData}/>
                            </Card>
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    );
};

export default TableView;