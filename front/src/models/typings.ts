interface Response  {
    response: any
    errorMessage: string
}

interface State  {
    loading: boolean
    rq: ITableDataRq
    table: ITableData | null
    tableList: string[]
    error: string
}

interface ITableData {
    name: string
    headers: ITableHeader[]
    rows: string[]
}

interface ITableHeader {
    columnName: string
    isNullable: boolean
    dataType: string
    characterMaximumLength: number
}

interface ITableDataRq {
    tableName: string
    where?: string
    template: TemplateType
}


export enum TemplateType {
    FIRST = "FIRST",
    SECOND = "SECOND",
    THIRD = "THIRD"
}

export type {
    Response,
    State,
    ITableData,
    ITableHeader,
    ITableDataRq
}
