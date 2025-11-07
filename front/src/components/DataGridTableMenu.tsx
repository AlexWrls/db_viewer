import React from 'react';
import { Table, Button, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ITableDataRq, State } from "../models/typings";

interface ChildProps {
    state: State;
    onDataChange: (data: ITableDataRq) => void;
}

interface TableRow {
    key: number;
    tables: string;
}

const DataGridTableMenu: React.FC<ChildProps> = (props: ChildProps) => {
    const [activeTable, setActiveTable] = React.useState<string | null>(null);

    const handleAction = (tableName: string) => {
        setActiveTable(tableName);
        props.onDataChange({ tableName, template: props.state.rq.template });
    };

    const columns: ColumnsType<TableRow> = [
        {
            title: 'Tables',
            dataIndex: 'tables',
            key: 'tables',
            onCell: () => ({
                style: {
                    padding: 0,
                }
            }),
            render: (tableName: string) => {
                const isActive = activeTable === tableName;
                return (
                    <Button
                        type={isActive ? "primary" : "default"}
                        size="small"
                        onClick={() => handleAction(tableName)}
                        style={{
                            width: '100%',
                            height: '100%',
                            minHeight: '40px',
                            fontWeight: isActive ? 'bold' : 'normal',
                            borderRadius: 0,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {tableName}
                    </Button>
                );
            },
        },
    ];

    const dataSource: TableRow[] = props.state.tableList.map((table, index) => ({
        key: index,
        tables: table,
    }));

    return (
        <Card style={{ height: '100%', width: '100%' }}>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
                scroll={{ y: 'calc(100vh - 200px)' }}
                loading={false}
                bordered={false}
                components={{
                    body: {
                        cell: (props: any) => (
                            <td
                                {...props}
                                style={{
                                    ...props.style,
                                    padding: '0',
                                    borderBottom: '1px solid #f0f0f0'
                                }}
                            />
                        ),
                    },
                }}
            />
        </Card>
    );
};

export default DataGridTableMenu;