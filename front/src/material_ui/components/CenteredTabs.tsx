import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {ITableDataRq, State, TemplateType} from "../../models/typings";

interface ChildProps {
    state: State
    onDataChange: (data: ITableDataRq) => void;
}

const templateMediator = new Map<number, TemplateType>([
    [0, TemplateType.FIRST],
    [1, TemplateType.SECOND],
    [2, TemplateType.THIRD],
]);

const CenteredTabs: React.FC<ChildProps> = (props: ChildProps) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Item Two" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
        </Box>
    );
}

export default CenteredTabs;