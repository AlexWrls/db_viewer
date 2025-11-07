import * as React from 'react';
import {useState} from "react";
import {Tabs} from "antd";
import {ITableDataRq, State, TemplateType} from "../models/typings";


interface ChildProps {
    state: State
    onDataChange: (data: ITableDataRq) => void;
}

const templateMediator = new Map<string, TemplateType>([
    ["0", TemplateType.FIRST],
    ["1", TemplateType.SECOND],
    ["2", TemplateType.THIRD],
]);

const CenteredTabs: React.FC<ChildProps> = (props: ChildProps) => {
    const [value, setValue] = useState("0");

    const handleChange = ( newValue: string) => {
        setValue(newValue);
        const type = templateMediator.get(newValue);
        props.onDataChange({tableName: "", template: type ? type : TemplateType.FIRST})
    };

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <Tabs
            type="card"
            activeKey={value.toString()}
            onChange={(activeKey) => handleChange(activeKey)}
        >
            <Tabs.TabPane tab="Item One" key="0" />
            <Tabs.TabPane tab="Item Two" key="1" />
            <Tabs.TabPane tab="Item Three" key="2" />
        </Tabs>
    );
}

export default CenteredTabs;