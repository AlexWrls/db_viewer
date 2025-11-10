import React, { useRef } from 'react';
import { Table, Card, Button, Alert, Input, Typography, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import SearchInput from "./SearchInput";
import {ITableDataRq, State} from "../models/typings";

const { Text } = Typography;

interface ChildProps {
    state: State;
    onDataChange: (data: ITableDataRq) => void;
}

interface TableRow {
    key: number;
    [key: string]: any;
}

const DataGridTable: React.FC<ChildProps> = (data: ChildProps) => {
    const search = useRef<string>(data.state.rq.where || "");

    const handleClickButtonSearch = () => {
        console.log(`handleClickButtonSearch=${JSON.stringify(search, null, 2)}`);
        data.onDataChange({
            tableName: data.state.rq.tableName,
            template: data.state.rq.template,
            where: search.current
        });
    };

    if (data.state.table === null) {
        return <Alert message="Ошибка загрузки таблицы" type="error" style={{ marginTop: 16 }} />;
    }

    const columns: ColumnsType<TableRow> = data.state.table.headers.map(i => ({
        title: i.columnName,
        dataIndex: i.columnName,
        key: i.columnName,
        sorter: (a, b) => a.key.valueOf() - b.key.valueOf(),
        defaultSortOrder: 'descend',
    }));

    const dataSource: TableRow[] = data.state.table.rows.map((row, index) => {
        const obj: TableRow = { key: index };
        data.state.table?.headers.forEach((column, colIndex) => {
            obj[column.columnName] = row[colIndex];
        });
        return obj;
    });

    const handleTestInKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleClickButtonSearch();
        }
    };

    const str: string[] = data.state.table?.headers.map(i => i.columnName) || [];

    const CustomToolbar = () => (
        <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Space align="center">
                <Text style={{ fontSize: '14px', color: '#666' }}>
                    select * from <Text strong>{data.state.table?.name.toUpperCase()}</Text> where
                </Text>
            </Space>

            <SearchInput
                onKeyPress={handleTestInKeyPress}
                value={search.current}
                data={str}
                onSelect={(value) => search.current = value}
            />

            <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleClickButtonSearch}
            >
                Найти
            </Button>
        </div>
    );

    return (
        <Card style={{ width: '100%', height: '100%' }}>
            <CustomToolbar />
            <Table
                columns={columns}
                dataSource={dataSource}
                size="small"
                scroll={{ y: 'calc(100vh - 320px)' }}
                pagination={{
                    pageSize: 20,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `Записи ${range[0]}-${range[1]} из ${total}`
                }}
                loading={false}
                rowSelection={{
                    type: 'checkbox',
                    checkStrictly: false,
                }}
                style={{ height: '100%'}}
            />
        </Card>
    );
};

export default DataGridTable;