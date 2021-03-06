﻿import { CalculatedColumnStrategy } from '../../Strategy/CalculatedColumnStrategy';
import '../../../stylesheets/adaptableblotter-style.css'

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AdaptableBlotterApp } from '../../View/AdaptableBlotterView';
import * as MenuRedux from '../../Redux/ActionsReducers/MenuRedux'
import * as GridRedux from '../../Redux/ActionsReducers/GridRedux'
import * as LayoutRedux from '../../Redux/ActionsReducers/LayoutRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import * as ColumnChooserRedux from '../../Redux/ActionsReducers/ColumnChooserRedux'
import { IAdaptableBlotterStore } from '../../Redux/Store/Interface/IAdaptableStore'
import { AdaptableBlotterStore } from '../../Redux/Store/AdaptableBlotterStore'
import { IMenuItem, IStrategy, IUIError, IUIConfirmation, ICellInfo } from '../../Core/Interface/IStrategy';
import { ICalendarService } from '../../Core/Services/Interface/ICalendarService'
import { CalendarService } from '../../Core/Services/CalendarService'
import { IAuditService } from '../../Core/Services/Interface/IAuditService'
import { AuditService } from '../../Core/Services/AuditService'
import { CalculatedColumnExpressionService } from '../../Core/Services/CalculatedColumnExpressionService'
import { ThemeService } from '../../Core/Services/ThemeService'
import { AuditLogService } from '../../Core/Services/AuditLogService'
import * as StrategyIds from '../../Core/StrategyIds'
import { CustomSortStrategy } from '../../Strategy/CustomSortStrategy'
import { SmartEditStrategy } from '../../Strategy/SmartEditStrategy'
import { ShortcutStrategy } from '../../Strategy/ShortcutStrategy'
import { UserDataManagementStrategy } from '../../Strategy/UserDataManagementStrategy'
import { PlusMinusStrategy } from '../../Strategy/PlusMinusStrategy'
import { ColumnChooserStrategy } from '../../Strategy/ColumnChooserStrategy'
import { ExportStrategy } from '../../Strategy/ExportStrategy'
import { FlashingCellsHypergridStrategy } from '../../Strategy/FlashingCellsHypergridStrategy'
import { CalendarStrategy } from '../../Strategy/CalendarStrategy'
import { ConditionalStyleHypergridStrategy } from '../../Strategy/ConditionalStyleHypergridStrategy'
import { QuickSearchStrategy } from '../../Strategy/QuickSearchStrategy'
import { AdvancedSearchStrategy } from '../../Strategy/AdvancedSearchStrategy'
import { FilterStrategy } from '../../Strategy/FilterStrategy'
import { CellValidationStrategy } from '../../Strategy/CellValidationStrategy'
import { LayoutStrategy } from '../../Strategy/LayoutStrategy'
import { ThemeStrategy } from '../../Strategy/ThemeStrategy'
import { DashboardStrategy } from '../../Strategy/DashboardStrategy'
import { TeamSharingStrategy } from '../../Strategy/TeamSharingStrategy'
import { IColumnFilter, IColumnFilterContext } from '../../Core/Interface/IFilterStrategy';
import { ICellValidationRule, ICellValidationStrategy } from '../../Core/Interface/ICellValidationStrategy';
import { IEvent } from '../../Core/Interface/IEvent';
import { EventDispatcher } from '../../Core/EventDispatcher'
import { Helper } from '../../Core/Helper';
import { EnumExtensions } from '../../Core/Extensions';
import { DataType, LeafExpressionOperator, SortOrder, QuickSearchDisplayType, DistinctCriteriaPairValue, CellValidationMode, FontSize, FontStyle, FontWeight } from '../../Core/Enums'
import { IAdaptableBlotter, IAdaptableStrategyCollection, ISelectedCells, IColumn, IRawValueDisplayValuePair, IAdaptableBlotterOptions } from '../../Core/Interface/IAdaptableBlotter'
import { Expression } from '../../Core/Expression/Expression';
import { CustomSortDataSource } from './CustomSortDataSource'
import { FilterAndSearchDataSource } from './FilterAndSearchDataSource'
import { FilterFormReact } from '../../View/FilterForm';
import { IDataChangingEvent, IDataChangedEvent } from '../../Core/Services/Interface/IAuditService'
import { ObjectFactory } from '../../Core/ObjectFactory';
import { ILayout } from '../../Core/Interface/ILayoutStrategy';
import { IStyle } from '../../Core/Interface/IConditionalStyleStrategy';
import { LayoutState } from '../../Redux/ActionsReducers/Interface/IState'
import { DefaultAdaptableBlotterOptions } from '../../Core/DefaultAdaptableBlotterOptions'
import { ContextMenuReact } from '../../View/ContextMenu'
import { ICalculatedColumn } from "../../Core/Interface/ICalculatedColumnStrategy";
import { ICalculatedColumnExpressionService } from "../../Core/Services/Interface/ICalculatedColumnExpressionService";

//icon to indicate toggle state
const UPWARDS_BLACK_ARROW = '\u25b2' // aka '▲'
const DOWNWARDS_BLACK_ARROW = '\u25bc' // aka '▼'
const filterOffRaw: any = {
    type: "image/png",
    data: "iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAChSURBVChTzZHBCoUgFET9TqEiskgyWoutQvRLRIr+cR7XQAjiJW/1BgZmMUevXsY5xy9OoDEGMcYiUzeB67qibVuwQjVNA6311V+WBeM4vsLDMEApde/1fY9pmtI453neHEKAlBJd1z0fXtc16PbjODK07zvmeUZVVd8nooc75zJIOX3Gm6i0bVsGKf8xKIRIuyJTLgJJ3nvQzsjW2geIsQ/pr9hMVrSncAAAAABJRU5ErkJggg=="
};
const filterOnRaw = {
    type: "image/png",
    data: "iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAACoSURBVChTY3BqfP2fHAzWmDbj7f8p294RhVOBasEa02e+/e/VBmQQCTxaX/9PnvYGoj5ywpv/Qd2ENft3vv4f1gfVBAP+nW/+h/a+ATtn1q73KHjytvdgg3070DTBgHvL6/8g22fsQGiaDmSHA21xaybgIpDHixa8hWssnA8NDEIApCh3LkIjiD2INYJCL2X6W3B8gdhEaQQBUOCA4gyE8+e9xaKJgQEA/74BNE3cElkAAAAASUVORK5CYII="
}
const filterOn = new Image();
filterOn.src = 'data:' + filterOnRaw.type + ';base64,' + filterOnRaw.data;
const filterOff = new Image();
filterOff.src = 'data:' + filterOffRaw.type + ';base64,' + filterOffRaw.data;

const getFilterIcon = (state: boolean) => {
    return state ? filterOn : filterOff;
}

export class AdaptableBlotter implements IAdaptableBlotter {
    public Strategies: IAdaptableStrategyCollection
    public AdaptableBlotterStore: IAdaptableBlotterStore

    public CalendarService: ICalendarService
    public AuditService: IAuditService
    public ThemeService: ThemeService
    public AuditLogService: AuditLogService
    public CalculatedColumnExpressionService: ICalculatedColumnExpressionService
    private filterContainer: HTMLDivElement
    private contextMenuContainer: HTMLDivElement
    public BlotterOptions: IAdaptableBlotterOptions

    private cellStyleHypergridMap: Map<any, Map<string, CellStyleHypergrid>> = new Map()
    private cellFlashIntervalHypergridMap: Map<any, Map<string, number>> = new Map()

    constructor(private grid: any, private container: HTMLElement, options?: IAdaptableBlotterOptions) {
        //we init with defaults then overrides with options passed in the constructor
        this.BlotterOptions = Object.assign({}, DefaultAdaptableBlotterOptions, options)

        this.AdaptableBlotterStore = new AdaptableBlotterStore(this);

        // create the services
        this.CalendarService = new CalendarService(this);
        this.AuditService = new AuditService(this);
        this.ThemeService = new ThemeService(this)
        this.AuditLogService = new AuditLogService(this);
        this.CalculatedColumnExpressionService = new CalculatedColumnExpressionService(this, (columnId, record) => {
            let column = this.getHypergridColumn(columnId);
            return this.valOrFunc(record, column)
        });

        //we build the list of strategies
        //maybe we don't need to have a map and just an array is fine..... dunno'
        this.Strategies = new Map<string, IStrategy>();
        this.Strategies.set(StrategyIds.CustomSortStrategyId, new CustomSortStrategy(this))
        this.Strategies.set(StrategyIds.CalculatedColumnStrategyId, new CalculatedColumnStrategy(this))
        this.Strategies.set(StrategyIds.SmartEditStrategyId, new SmartEditStrategy(this))
        this.Strategies.set(StrategyIds.ShortcutStrategyId, new ShortcutStrategy(this))
        this.Strategies.set(StrategyIds.UserDataManagementStrategyId, new UserDataManagementStrategy(this))
        this.Strategies.set(StrategyIds.PlusMinusStrategyId, new PlusMinusStrategy(this, false))
        this.Strategies.set(StrategyIds.ColumnChooserStrategyId, new ColumnChooserStrategy(this))
        //this.Strategies.set(StrategyIds.ExcelExportStrategyId, new ExcelExportStrategy(this))
        this.Strategies.set(StrategyIds.FlashingCellsStrategyId, new FlashingCellsHypergridStrategy(this))
        this.Strategies.set(StrategyIds.CalendarStrategyId, new CalendarStrategy(this))
        this.Strategies.set(StrategyIds.AdvancedSearchStrategyId, new AdvancedSearchStrategy(this))
        this.Strategies.set(StrategyIds.ConditionalStyleStrategyId, new ConditionalStyleHypergridStrategy(this))
        this.Strategies.set(StrategyIds.QuickSearchStrategyId, new QuickSearchStrategy(this))
        this.Strategies.set(StrategyIds.FilterStrategyId, new FilterStrategy(this))
        this.Strategies.set(StrategyIds.ThemeStrategyId, new ThemeStrategy(this))
        this.Strategies.set(StrategyIds.CellValidationStrategyId, new CellValidationStrategy(this))
        this.Strategies.set(StrategyIds.LayoutStrategyId, new LayoutStrategy(this))
        this.Strategies.set(StrategyIds.DashboardStrategyId, new DashboardStrategy(this))
        this.Strategies.set(StrategyIds.TeamSharingStrategyId, new TeamSharingStrategy(this))

        this.filterContainer = this.container.ownerDocument.createElement("div")
        this.filterContainer.id = "filterContainer"
        this.filterContainer.style.position = 'absolute'
        this.filterContainer.style.visibility = "hidden"
        this.container.ownerDocument.body.appendChild(this.filterContainer)

        this.contextMenuContainer = this.container.ownerDocument.createElement("div")
        this.contextMenuContainer.id = "contextMenuContainer"
        this.contextMenuContainer.style.position = 'absolute'
        this.container.ownerDocument.body.appendChild(this.contextMenuContainer)
        ReactDOM.render(ContextMenuReact(this), this.contextMenuContainer);

        ReactDOM.render(AdaptableBlotterApp(this), this.container);

        this.AdaptableBlotterStore.Load
            .then(() => this.Strategies.forEach(strat => strat.InitializeWithRedux()),
            (e) => {
                console.error('Failed to Init AdaptableBlotterStore : ', e);
                //for now i'm still initializing the strategies even if loading state has failed.... 
                //we may revisit that later
                this.Strategies.forEach(strat => strat.InitializeWithRedux())
            })
            .then(
            () => this.initInternalGridLogic(grid),
            (e) => {
                console.error('Failed to Init Strategies : ', e);
                //for now i'm still initializing the grid even if loading state has failed.... 
                //we may revisit that later
                this.initInternalGridLogic(grid)
            })
    }

    public InitAuditService() {
    }

    private buildFontCSSShorthand(fontCssShortHand: string, newStyle: IStyle): string {
        var el = document.createElement("span");
        //we we let teh CSS parse build the different properties of the font CSS
        el.style.font = fontCssShortHand
        //we now update individual properties
        el.style.fontWeight = FontWeight[newStyle.FontWeight].toLocaleLowerCase()
        el.style.fontStyle = FontStyle[newStyle.FontStyle].toLocaleLowerCase()
        //font size can be null
        if (newStyle.FontSize) {
            el.style.fontSize = EnumExtensions.getCssFontSizeFromFontSizeEnum(newStyle.FontSize)
        }
        //we return the new font CSS shorthand
        return el.style.font
    }

    public setColumnIntoStore() {
        // let columns: IColumn[] = this.grid.behavior.columns.map((x: any) => {
        let activeColumns: IColumn[] = this.grid.behavior.getActiveColumns().map((x: any, index: number) => {
            return {
                ColumnId: x.name ? x.name : "Unknown Column",
                FriendlyName: x.header ? x.header : (x.name ? x.name : "Unknown Column"),
                DataType: this.getColumnDataType(x),
                Visible: true,
                Index: index
            }
        });
        let hiddenColumns: IColumn[] = this.grid.behavior.getHiddenColumns().map((x: any) => {
            return {
                ColumnId: x.name ? x.name : "Unknown Column",
                FriendlyName: x.header ? x.header : (x.name ? x.name : "Unknown Column"),
                DataType: this.getColumnDataType(x),
                Visible: false,
                Index: -1
            }
        });
        this.AdaptableBlotterStore.TheStore.dispatch<GridRedux.SetColumnsAction>(GridRedux.SetColumns(activeColumns.concat(hiddenColumns)));
    }

    public hideFilterForm() {
        ReactDOM.unmountComponentAtNode(this.filterContainer)
        this.filterContainer.style.visibility = 'hidden'
    }

    public setNewColumnListOrder(VisibleColumnList: Array<IColumn>): void {
        VisibleColumnList.forEach((column, index) => {
            //we use allcolumns so we can show previously hidden columns
            let oldcolindex = this.grid.behavior.allColumns.findIndex((x: any) => x.name == column.ColumnId)
            this.grid.behavior.showColumns(false, oldcolindex, index, false)
            //this.grid.swapColumns(index, oldcolindex);
        })
        this.grid.behavior.getActiveColumns().filter((x: any) => VisibleColumnList.findIndex(y => y.ColumnId == x.name) < 0).forEach(((col: any) => {
            this.grid.behavior.hideColumns(false, this.grid.behavior.allColumns.indexOf(col))
        }))
        this.grid.behavior.changed()
        //if the event columnReorder starts to be fired when changing the order programmatically 
        //we'll need to remove that line
        this.setColumnIntoStore();
    }

    private _onKeyDown: EventDispatcher<IAdaptableBlotter, JQueryKeyEventObject | KeyboardEvent> = new EventDispatcher<IAdaptableBlotter, JQueryKeyEventObject | KeyboardEvent>();
    public onKeyDown(): IEvent<IAdaptableBlotter, JQueryKeyEventObject | KeyboardEvent> {
        return this._onKeyDown;
    }

    private _onGridDataBound: EventDispatcher<IAdaptableBlotter, IAdaptableBlotter> = new EventDispatcher<IAdaptableBlotter, IAdaptableBlotter>();
    public onGridDataBound(): IEvent<IAdaptableBlotter, IAdaptableBlotter> {
        return this._onGridDataBound;
    }

    public createMenu() {
        let menuItems: IMenuItem[] = [];
        this.Strategies.forEach(x => menuItems.push(...x.getMenuItems()));

        this.AdaptableBlotterStore.TheStore.dispatch<MenuRedux.SetMenuItemsAction>(MenuRedux.SetMenuItems(menuItems));
    }

    public sortColumnGridIndex: number = -1
    public sortColumnName: string = ""
    public sortOrder: SortOrder
    public toggleSort(gridColumnIndex: number) {
        //Toggle sort one column at a time
        //we need the index property not the index of the collection
        let gridColumnIndexTransposed = this.grid.behavior.getActiveColumns()[gridColumnIndex].index;
        if (this.sortColumnGridIndex === gridColumnIndexTransposed) {
            if (this.sortOrder == SortOrder.Descending) {
                this.sortColumnGridIndex = -1;
            }
            else {
                this.sortOrder = SortOrder.Descending
            }
        } else {
            this.sortOrder = SortOrder.Ascending
            //we need the index property not the index of the collection
            //this.sortColumnGridIndex = gridColumnIndex;
            this.sortColumnGridIndex = gridColumnIndexTransposed;
            this.sortColumnName = this.grid.behavior.getActiveColumns()[gridColumnIndex].name
        }
        this.grid.behavior.reindex();
    }

    public getPrimaryKeyValueFromRecord(record: any): any {
        return record[this.BlotterOptions.primaryKey]
    }

    public gridHasCurrentEditValue(): boolean {
        return this.grid.cellEditor;
    }

    public getCurrentCellEditValue(): any {
        if (this.grid.cellEditor) {
            return this.grid.cellEditor.getEditorValue()
        }
        return "";
    }

    getActiveCell(): ICellInfo {
        let currentCell = this.grid.selectionModel.getLastSelection();

        if (currentCell) {
            let column = this.grid.behavior.getActiveColumns()[currentCell.origin.x]
            let row = this.grid.behavior.dataModel.dataSource.getRow(currentCell.origin.y)
            let primaryKey = this.getPrimaryKeyValueFromRecord(row)

            //this function needs the column.index from the schema
            // let value = this.grid.behavior.dataModel.dataSource.getValue(currentCell.origin.x, currentCell.origin.y)
            //let value = this.grid.behavior.dataModel.dataSource.getValue(column.index, currentCell.origin.y)
            //21/08/17 : we now use the valOrFunc in case it;s a calculatedcolumn
            let value = this.valOrFunc(row, column)
            return { Id: primaryKey, ColumnId: column.name, Value: value }
        }
        return null
    }

    //this method will returns selected cells only if selection mode is cells or multiple cells. If the selection mode is row it will returns fuck all
    public getSelectedCells(): ISelectedCells {
        let selectionMap: Map<string, { columnID: string, value: any }[]> = new Map<string, { columnID: string, value: any }[]>();
        var selected: Array<any> = this.grid.selectionModel.getSelections();
        for (let rectangle of selected) {
            //we don't use firstSelectedCell and lastSelectedCell as they keep the order of the click. i.e. firstcell can be below lastcell....
            //for (let columnIndex = rectangle.firstSelectedCell.x; columnIndex <= rectangle.lastSelectedCell.x; columnIndex++) {
            for (let columnIndex = rectangle.origin.x; columnIndex <= rectangle.origin.x + rectangle.width; columnIndex++) {
                let column = this.grid.behavior.getActiveColumns()[columnIndex]
                for (let rowIndex = rectangle.origin.y; rowIndex <= rectangle.origin.y + rectangle.height; rowIndex++) {
                    // for (let rowIndex = rectangle.firstSelectedCell.y; rowIndex <= rectangle.lastSelectedCell.y; rowIndex++) {
                    let row = this.grid.behavior.dataModel.dataSource.getRow(rowIndex)
                    let primaryKey = this.getPrimaryKeyValueFromRecord(row)
                    //this function needs the column.index from the schema
                    // let value = this.grid.behavior.dataModel.dataSource.getValue(columnIndex, rowIndex)
                    // let value = this.grid.behavior.dataModel.dataSource.getValue(column.index, rowIndex)
                    //21/08/17 : we now use the valOrFunc in case it;s a calculatedcolumn
                    let value = this.valOrFunc(row, column)
                    //this line is pretty much doing the same....just keeping it for the record
                    //maybe we could get it directly from the row..... dunno wht's best
                    // let value = column.getValue(rowIndex)
                    let valueArray = selectionMap.get(primaryKey);
                    if (valueArray == undefined) {
                        valueArray = []
                        selectionMap.set(primaryKey, valueArray);
                    }
                    valueArray.push({ columnID: column.name, value: value });
                }
            }
        }

        return {
            Selection: selectionMap
        };
    }



    public getColumnDataType(column: any): DataType {
        //Some columns can have no ID or Title. we return string as a consequence but it needs testing
        if (!column) {
            console.log('columnId is undefined returning String for Type')
            return DataType.String;
        }

        if (column) {
            if (!column.hasOwnProperty('type')) {
                let dateType: DataType

                switch (column.getType()) {
                    case 'string':
                        dateType = DataType.String;
                        break;
                    case 'number':
                    case 'int':
                    case 'float':
                        dateType = DataType.Number;
                        break
                    case 'boolean':
                        dateType = DataType.Boolean;
                        break
                    case 'date':
                        dateType = DataType.Date;
                        break
                    case 'object':
                        dateType = DataType.Object;
                        break
                    //for calculated column that's what happens
                    case 'unknown': {
                        //get First record
                        let record = this.getFirstRecord()
                        var value = this.valOrFunc(record, column)
                        if (value instanceof Date) {
                            dateType = DataType.Date
                        }
                        switch (typeof value) {
                            case 'string':
                                dateType = DataType.String;
                                break
                            case 'number':
                                dateType = DataType.Number;
                                break
                            case 'boolean':
                                dateType = DataType.Boolean;
                                break
                            case 'object':
                                dateType = DataType.Object;
                                break
                            default:
                                break;
                        }
                    }
                    default:
                        break;
                }
                console.log('There is no defined type. Defaulting to type of the first value for column ' + column.name, DataType[dateType])
                return dateType
            }

            let type = column.type;
            switch (type) {
                case 'string':
                    return DataType.String;
                case 'number':
                    return DataType.Number;
                case 'boolean':
                    return DataType.Boolean;
                case 'date':
                    return DataType.Date;
                case 'object':
                    return DataType.Object;
                default:
                    break;
                //  }
            }
        }
        console.log('columnId does not exist')
        return DataType.String;
    }

    public setValue(cellInfo: ICellInfo): void {
        //there is a bug in hypergrid 15/12/16 and the row object on the cellEditor is the row below the one currently edited
        //so we just close editor for now even if not the one where we set the value
        //if(this.gridHasCurrentEditValue() && this.getPrimaryKeyValueFromRecord(this.grid.cellEditor.row) == id)
        this.cancelEdit()

        let row = this.grid.behavior.dataModel.dataSource.findRow(this.BlotterOptions.primaryKey, cellInfo.Id)
        let oldValue = row[cellInfo.ColumnId]
        row[cellInfo.ColumnId] = cellInfo.Value;

        this.AuditLogService.AddEditCellAuditLog(cellInfo.Id,
            cellInfo.ColumnId,
            oldValue, cellInfo.Value)

        //the grid will eventually pick up the change but we want to force the refresh in order to avoid the weird lag
        this.ReindexAndRepaint()
    }

    public setValueBatch(batchValues: ICellInfo[]): void {
        //no need to have a batch mode so far.... we'll see in the future performance
        for (let element of batchValues) {
            let row = this.grid.behavior.dataModel.dataSource.findRow(this.BlotterOptions.primaryKey, element.Id)
            let oldValue = row[element.ColumnId]
            row[element.ColumnId] = element.Value
            this.AuditLogService.AddEditCellAuditLog(element.Id,
                element.ColumnId,
                oldValue, element.Value)
        }
        //the grid will eventually pick up the change but we want to force the refresh in order to avoid the weird lag
        this.ReindexAndRepaint()
    }

    public cancelEdit() {
        this.grid.cancelEditing()
    }

    public forAllRecordsDo(func: (record: any) => any): any {
        //we use getData instead of this.grid.behavior.dataModel.dataSource as this method is used to compute stuff on filtered data as well
        let ds = this.grid.behavior.getData()
        ds.forEach((row: any) => func(row))
    }

    public getRecordIsSatisfiedFunction(id: any, type: "getColumnValue" | "getDisplayColumnValue"): (columnName: string) => any {
        if (type == "getColumnValue") {
            let record = this.grid.behavior.dataModel.dataSource.findRow(this.BlotterOptions.primaryKey, id);
            return (columnName: string) => {
                let column = this.getHypergridColumn(columnName);
                return this.valOrFunc(record, column);
            }
        }
        else {
            return (columnName: string) => { return this.getDisplayValue(id, columnName); }
        }
    }
    public getRecordIsSatisfiedFunctionFromRecord(record: any, type: "getColumnValue" | "getDisplayColumnValue"): (columnName: string) => any {
        if (type == "getColumnValue") {
            return (columnName: string) => {
                let column = this.getHypergridColumn(columnName);
                return this.valOrFunc(record, column);
            }
        }
        else {
            return (columnName: string) => { return this.getDisplayValueFromRecord(record, columnName); }
        }
    }

    public selectCells(cells: ICellInfo[]): void {
    }

    public getColumnHeader(columnId: string): string {
        let column = this.AdaptableBlotterStore.TheStore.getState().Grid.Columns.find(x => x.ColumnId == columnId);
        if (column) {
            return column.FriendlyName
        }
        else {
            return "";
        }
    }

    public getColumnIndex(columnName: string): number {
        // This is not true anymore //be carefull this returns the index y of the cell. Not the actual index in the collection
        // let activeColumn: any = this.grid.behavior.getActiveColumns().find((x: any) => x.name == columnName);
        // return (activeColumn) ? activeColumn.index : -1;
        let column = this.AdaptableBlotterStore.TheStore.getState().Grid.Columns.find(x => x.ColumnId == columnName)
        if (column) {
            return column.Index
        }
        else {
            return -1;
        }
    }


    public isColumnReadonly(columnId: string): boolean {
        let activeColumn: any = this.grid.behavior.getActiveColumns().find((x: any) => x.name == columnId);
        if (this.grid.cellEditor) {
            if (this.grid.cellEditor.column.name == columnId) {
                //we are already editing that column so that's an easy answer
                return false
            }
            //in our current use cases as of 02/10/2017 it should never happens that we
            //check for editable on a different column that we edit
            else {
                console.warn("Editing " + this.grid.cellEditor.column.name + " but checking for editable on column " + columnId)
            }
        }
        else {
            //now instead of checking if editor was defined at design time on the column we try to instantiate the editor
            //for that column directly
            // let colprop = this.grid.behavior.getColumnProperties((activeColumn) ? activeColumn.index : -1)
            let cellEvent = new this.grid.behavior.CellEvent
            cellEvent.resetGridCY(activeColumn.index, 1);
            let editor = this.grid.behavior.getCellEditorAt(cellEvent);
            if(editor)
            {
                editor.cancelEditing()
                editor = null
                return false;
            }
            return true

            // if (colprop.editor) {
            //     return false;
            // }
            // else {

            //     return true
            // }
        }
    }

    public setCustomSort(columnId: string, comparer: Function): void {
        //nothing to do except the reindex so the CustomSortSource does it's job if needed
        if (this.sortColumnName == columnId) {
            this.ReindexAndRepaint()
        }
    }

    public removeCustomSort(columnId: string): void {
        //nothing to do except the reindex so the CustomSortSource does it's job if needed
        if (this.sortColumnName == columnId) {
            this.ReindexAndRepaint()
        }
    }

    public ReindexAndRepaint() {
        this.grid.behavior.reindex();
        this.grid.repaint();
    }

    public getColumnValueDisplayValuePairDistinctList(columnId: string, distinctCriteria: DistinctCriteriaPairValue): Array<IRawValueDisplayValuePair> {
        let returnMap = new Map<string, IRawValueDisplayValuePair>();
        let column = this.getHypergridColumn(columnId);
        //We bypass the whole DataSource Stuff as we need to get ALL the data
        let data = this.grid.behavior.dataModel.getData()
        for (var index = 0; index < data.length; index++) {
            var element = data[index]
            let displayString = this.getDisplayValueFromRecord(element, columnId)
            let rawValue = this.valOrFunc(element, column)
            if (distinctCriteria == DistinctCriteriaPairValue.RawValue) {
                returnMap.set(rawValue, { RawValue: rawValue, DisplayValue: displayString });
            }
            else if (distinctCriteria == DistinctCriteriaPairValue.DisplayValue) {
                returnMap.set(displayString, { RawValue: rawValue, DisplayValue: displayString });
            }
        }
        return Array.from(returnMap.values()).slice(0, this.BlotterOptions.maxColumnValueItemsDisplayed);
    }



    public exportBlotter(): void {
    }

    public getDisplayValue(id: any, columnId: string): string {
        let row = this.grid.behavior.dataModel.dataSource.findRow(this.BlotterOptions.primaryKey, id)
        return this.getDisplayValueFromRecord(row, columnId)
    }

    public getDisplayValueFromRecord(row: any, columnId: string) {
        let column = this.getHypergridColumn(columnId);
        if (column) {
            let formatter = column.getFormatter()
            return formatter(this.valOrFunc(row, column))
        }
        return "";
    }
    public getColumnFormatter(columnId: string) {
        let column = this.getHypergridColumn(columnId);
        if (column && column.properties.format) {
            return column.getFormatter()
        }
        return null;
    }

    // public getDisplayValueFromRecordAndFormatter(row: any, formatter: any, columnId: string) {
    //     if (formatter) {
    //         return formatter(row[columnId])
    //     }
    //     return row[columnId];
    // }

    public addCellStyle(rowIdentifierValue: any, columnIndex: number, style: string, timeout?: number): void {
        throw 'Not implemented for hypergrid see addCellStyleHypergrid';
    }

    public addCellStyleHypergrid(rowIdentifierValue: any, columnId: string, style: CellStyleHypergrid, timeout?: number): void {
        //here we don't call Repaint as we consider that we already are in the repaint loop
        let cellStyleHypergridColumns = this.cellStyleHypergridMap.get(rowIdentifierValue);
        if (!cellStyleHypergridColumns) {
            cellStyleHypergridColumns = new Map()
            this.cellStyleHypergridMap.set(rowIdentifierValue, cellStyleHypergridColumns)
        }
        let cellStyleHypergrid = cellStyleHypergridColumns.get(columnId)
        if (!cellStyleHypergrid) {
            cellStyleHypergrid = {}
            cellStyleHypergridColumns.set(columnId, cellStyleHypergrid)
        }

        if (style.flashBackColor) {
            cellStyleHypergrid.flashBackColor = style.flashBackColor
            if (timeout) {
                let cellIntervalColumns = this.cellFlashIntervalHypergridMap.get(rowIdentifierValue);
                if (!cellIntervalColumns) {
                    cellIntervalColumns = new Map()
                    this.cellFlashIntervalHypergridMap.set(rowIdentifierValue, cellIntervalColumns)
                }
                let cellFlashIntervalHypergrid = cellIntervalColumns.get(columnId)
                if (cellFlashIntervalHypergrid) {
                    clearTimeout(cellFlashIntervalHypergrid)
                    cellIntervalColumns.set(columnId, null)
                }
                let timeoutInterval: number = setTimeout(() => this.removeCellStyleHypergrid(rowIdentifierValue, columnId, 'flash'), timeout);
                cellIntervalColumns.set(columnId, timeoutInterval)
            }
        }
        if (style.quickSearchBackColor) {
            cellStyleHypergrid.quickSearchBackColor = style.quickSearchBackColor
        }
        //There is never a timeout for CS
        if (style.conditionalStyleColumn) {
            cellStyleHypergrid.conditionalStyleColumn = style.conditionalStyleColumn
        }

        // let rowIndex = this.getRowIndexHypergrid(rowIdentifierValue)
        // if (rowIndex >= 0) {
        //     if (style.flashBackColor) {
        //         this.grid.behavior.setCellProperty(columnIndex, rowIndex, 'flashBackgroundColor', style.flashBackColor)
        //         if (timeout) {
        //             setTimeout(() => this.removeCellStyleByIndex(columnIndex, rowIndex, 'flash'), timeout);
        //         }
        //     }
        //     if (style.quickSearchBackColor) {
        //         this.grid.behavior.setCellProperty(columnIndex, rowIndex, 'quickSearchBackColor', style.quickSearchBackColor)
        //     }
        //     //There is never a timeout for CS
        //     // we have a bug where if the forecolor is not selected (as is now possible) it defaults to using white?  not sure why it doenst ignore it. 
        //     if (style.conditionalStyleColumn) {
        //         this.grid.behavior.setCellProperty(columnIndex, rowIndex, 'conditionalStyleColumn', style.conditionalStyleColumn)
        //     }
        // }
    }

    public addRowStyleHypergrid(rowIdentifierValue: any, style: CellStyleHypergrid, timeout?: number): void {
        let cellStyleHypergridColumns = this.cellStyleHypergridMap.get(rowIdentifierValue);
        if (!cellStyleHypergridColumns) {
            cellStyleHypergridColumns = new Map()
            this.cellStyleHypergridMap.set(rowIdentifierValue, cellStyleHypergridColumns)
        }
        for (let column of this.AdaptableBlotterStore.TheStore.getState().Grid.Columns) {
            let cellStyleHypergrid = cellStyleHypergridColumns.get(column.ColumnId)
            if (!cellStyleHypergrid) {
                cellStyleHypergrid = {}
                cellStyleHypergridColumns.set(column.ColumnId, cellStyleHypergrid)
            }
            //here we don't call Repaint as we consider that we already are in the repaint loop
            //There is never a timeout for CS
            if (style.conditionalStyleRow) {
                cellStyleHypergrid.conditionalStyleRow = style.conditionalStyleRow
            }
        }
    }

    public getRowIndexHypergrid(rowIdentifierValue: any): number {
        //11/01/17 We cannot use findRow as it returns the rowIndex from the original DataSource
        //I leave the getIndexedData for now but we would need to optimize that.... since we create a big array every iteration
        // let row = this.grid.behavior.dataModel.dataSource.findRow(this.primaryKey, rowIdentifierValue)
        // let rowIndex = this.grid.behavior.dataModel.dataSource.getProperty('foundRowIndex')
        // return rowIndex
        let rowIndex = this.grid.behavior.dataModel.getIndexedData().findIndex((x: any) => {
            if (x && x.hasOwnProperty(this.BlotterOptions.primaryKey)) {
                return x[this.BlotterOptions.primaryKey] == rowIdentifierValue
            }
            return false
        })
        return rowIndex
    }

    public addRowStyle(rowIdentifierValue: any, style: string, timeout?: number): void {
        throw 'Not implemented for hypergrid see addRowStyleHypergrid';
    }

    public removeAllCellStylesWithRegex(regex: RegExp): void {
    }

    public removeAllRowStylesWithRegex(regex: RegExp): void {
    }


    public removeCellStyleHypergrid(rowIdentifierValue: any, columnId: string, style: 'flash' | 'csColumn' | 'csRow' | 'QuickSearch'): void {
        let cellStyleHypergridColumns = this.cellStyleHypergridMap.get(rowIdentifierValue);
        if (!cellStyleHypergridColumns) {
            cellStyleHypergridColumns = new Map()
            this.cellStyleHypergridMap.set(rowIdentifierValue, cellStyleHypergridColumns)
        }
        let cellStyleHypergrid = cellStyleHypergridColumns.get(columnId)
        if (!cellStyleHypergrid) {
            cellStyleHypergrid = {}
            cellStyleHypergridColumns.set(columnId, cellStyleHypergrid)
        }
        if (style == 'flash') {
            cellStyleHypergrid.flashBackColor = undefined
            this.grid.repaint()
        }
        if (style == 'csColumn') {
            cellStyleHypergrid.conditionalStyleColumn = undefined
            this.grid.repaint()
        }
        if (style == 'csRow') {
            cellStyleHypergrid.conditionalStyleRow = undefined
            this.grid.repaint()
        }
        if (style == 'QuickSearch') {
            cellStyleHypergrid.quickSearchBackColor = undefined
        }
    }

    public removeAllCellStyleHypergrid(style: 'flash' | 'csColumn' | 'csRow' | 'QuickSearch'): void {
        this.cellStyleHypergridMap.forEach((cellStyleHypergridColumns) => {
            cellStyleHypergridColumns.forEach((cellStyleHypergrid) => {
                if (style == 'flash') {
                    cellStyleHypergrid.flashBackColor = undefined
                    this.grid.repaint()
                }
                if (style == 'csColumn') {
                    cellStyleHypergrid.conditionalStyleColumn = undefined
                    this.grid.repaint()
                }
                if (style == 'csRow') {
                    cellStyleHypergrid.conditionalStyleRow = undefined
                    this.grid.repaint()
                }
                if (style == 'QuickSearch') {
                    cellStyleHypergrid.quickSearchBackColor = undefined
                }
            })
        })
    }

    public removeCellStyle(rowIdentifierValue: any, columnIndex: number, style: string): void {
    }

    public removeRowStyle(rowIdentifierValue: any, style: string): void {
    }

    public getAllRowIds(): string[] {
        throw Error("Should not be used")
        // return []
        // //we use getData instead of this.grid.behavior.dataModel.dataSource as this method is used to compute stuff on filtered data as well
        // let ds = this.grid.behavior.getData()
        // let count = ds.length;
        // let result = new Array(count);
        // for (var y = 0; y < count; y++) {
        //     result[y] = ds[y][this.BlotterOptions.primaryKey];
        // }
        // return result
    }

    public hideRows(rowIds: string[]): void {
    }

    public showRows(rowIds: string[]): void {

    }

    public getDirtyValueForColumnFromDataSource(columnName: string, identifierValue: any): any {
    }

    public isGridPageable(): boolean {
        return false
    }

    public applyColumnFilters(): void {
        this.ReindexAndRepaint()
    }
    public deleteCalculatedColumn(calculatedColumnID: string) {

        let colIndex = this.grid.behavior.getColumns().findIndex((x: any) => x.name == calculatedColumnID)
        if (colIndex > -1) {
            this.grid.behavior.getColumns().splice(colIndex, 1)
            //we re-index the Column Object since we are removing the Schema 
            for (let i = colIndex; i < this.grid.behavior.getColumns().length; i++) {
                this.grid.behavior.getColumns()[i]._index = this.grid.behavior.getColumns()[i].index - 1
            }
        }
        let activecolIndex = this.grid.behavior.getActiveColumns().findIndex((x: any) => x.name == calculatedColumnID)
        if (activecolIndex > -1) {
            this.grid.behavior.getActiveColumns().splice(activecolIndex, 1)
            //No need to do it here since the collections share the same instance of Column
            // for (let i = activecolIndex; i < this.grid.behavior.getActiveColumns().length; i++) {
            //     this.grid.behavior.getActiveColumns()[i]._index = this.grid.behavior.getActiveColumns()[i].index - 1
            // }
        }

        //needs to be last since column.name load up the schema
        let schemaIndex = this.grid.behavior.dataModel.schema.findIndex((x: any) => x.name == calculatedColumnID)
        if (schemaIndex > -1) {
            this.grid.behavior.dataModel.schema.splice(schemaIndex, 1)
        }
        this.grid.behavior.changed()
        this.setColumnIntoStore();
    }
    public createCalculatedColumn(calculatedColumn: ICalculatedColumn) {
        let newSchema = {
            name: calculatedColumn.ColumnId,
            header: calculatedColumn.ColumnId,
            calculator: (dataRow: any, columnName: string) => {
                //22/08/17: I think that's a bug that's been fixed in v2 of hypergrid but for now we need to return the header
                if (Object.keys(dataRow).length == 0) {
                    return calculatedColumn.ColumnId
                }
                return this.CalculatedColumnExpressionService.ComputeExpressionValue(calculatedColumn.GetValueFunc, dataRow)
            }
        }
        this.grid.behavior.dataModel.schema.push(
            newSchema
        );
        this.grid.behavior.addColumn({
            index: this.grid.behavior.getColumns().length,
            header: newSchema.header,
            calculator: newSchema.calculator
        })
        // this.grid.behavior.createColumns();
        //this.grid.repaint();
        this.grid.behavior.changed()
        //if the event columnReorder starts to be fired when changing the order programmatically 
        //we'll need to remove that line
        this.setColumnIntoStore();
    }

    public getFirstRecord() {
        return this.grid.behavior.dataModel.getData()[0];
    }

    destroy() {
        ReactDOM.unmountComponentAtNode(this.container);
        ReactDOM.unmountComponentAtNode(this.filterContainer);
        ReactDOM.unmountComponentAtNode(this.contextMenuContainer);
    }
    
    private valOrFunc(dataRow: any, column: any) {
        var result, calculator;
        if (dataRow) {
            result = dataRow[column.name];
            calculator = (typeof result)[0] === 'f' && result || column.calculator;
            if (calculator) {
                result = calculator(dataRow, column.name);
            }
        }
        return result || result === 0 || result === false ? result : '';
    }

    public getHypergridColumn(columnId: string): any {
        return this.grid.behavior.allColumns.find((x: any) => x.name == columnId);
    }

    private initInternalGridLogic(grid: any) {
        grid.addEventListener("fin-keydown", (e: any) => {
            //we assume that the primitive event to a fin-keydown event will always be a keyboard event.
            //like that we avoid the need to have different logic for different grids....
            this._onKeyDown.Dispatch(this, e.detail.primitiveEvent);
        });
        //we'll see if we need to handle differently keydown when in edit mode internally or not....
        //I think we don't need to but hey.... you never know
        grid.addEventListener("fin-editor-keydown", (e: any) => {
            //we assume that the primitive event to a fin-keydown event will always be a keyboard event.
            //like that we avoid the need to have different logic for different grids....
            this._onKeyDown.Dispatch(this, e.detail.keyEvent);
        });
        //we hide the filterform if scrolling on the x axis
        grid.addEventListener('fin-scroll-x', (e: any) => {
            if (this.filterContainer.style.visibility == 'visible') {
                this.hideFilterForm();
            }
        });
        grid.addEventListener('fin-click', (e: any) => {
            if (this.filterContainer.style.visibility == 'visible') {
                this.hideFilterForm();
            }
            if (e.detail.primitiveEvent.isHeaderCell) {
                //try to check if we are clicking on the filter icon
                //we remove the scroll as get boundscell look at visible columns only
                let scrolledX = e.detail.gridCell.x - this.grid.getHScrollValue();
                let y = e.detail.gridCell.y;
                let headerBounds = this.grid.getBoundsOfCell({ x: scrolledX, y: y });
                let mouseCoordinate = e.detail.primitiveEvent.primitiveEvent.detail.mouse;
                let iconPadding = this.grid.properties.iconPadding;
                let filterIndex = this.AdaptableBlotterStore.TheStore.getState().Filter.ColumnFilters.findIndex(x => x.ColumnId == e.detail.primitiveEvent.column.name);
                let filterIconWidth = getFilterIcon(filterIndex >= 0).width;
                if (mouseCoordinate.x > (headerBounds.corner.x - filterIconWidth - iconPadding)) {
                    let filterContext: IColumnFilterContext = {
                        Column: this.AdaptableBlotterStore.TheStore.getState().Grid.Columns.find(c => c.ColumnId == e.detail.primitiveEvent.column.name),
                        Blotter: this,
                        ColumnValueType: DistinctCriteriaPairValue.DisplayValue
                    };
                    this.filterContainer.style.visibility = 'visible';
                    this.filterContainer.style.top = e.detail.primitiveEvent.primitiveEvent.detail.primitiveEvent.clientY + 'px';
                    this.filterContainer.style.left = e.detail.primitiveEvent.primitiveEvent.detail.primitiveEvent.clientX + 'px';
                    ReactDOM.render(FilterFormReact(filterContext), this.filterContainer);
                }
                e.preventDefault();
            }
        });
        grid.addEventListener("fin-context-menu", (e: any) => {
            if (e.detail.primitiveEvent.isHeaderCell) {
                this.AdaptableBlotterStore.TheStore.dispatch(MenuRedux.BuildColumnContextMenu(e.detail.primitiveEvent.column.name, e.detail.primitiveEvent.primitiveEvent.detail.primitiveEvent.clientX, e.detail.primitiveEvent.primitiveEvent.detail.primitiveEvent.clientY));
            }
        });
        grid.addEventListener("fin-before-cell-edit", (event: any) => {
            let dataChangedEvent: IDataChangingEvent;
            //there is a bug in hypergrid 07/02/16 and the row object on the event is the row below the one currently edited
            //so we use our methods....
            // var visibleRow = grid.renderer.visibleRows[event.detail.input.event.visibleRow.rowIndex];
            //they now attached correct row somewhere else....
            let row = this.grid.behavior.dataModel.getRow(event.detail.input.event.visibleRow.rowIndex);
            dataChangedEvent = { ColumnId: event.detail.input.column.name, NewValue: event.detail.newValue, IdentifierValue: this.getPrimaryKeyValueFromRecord(row) };
            let failedRules: ICellValidationRule[] = this.AuditService.CheckCellChanging(dataChangedEvent);
            if (failedRules.length > 0) {
                let cellValidationStrategy: ICellValidationStrategy = this.Strategies.get(StrategyIds.CellValidationStrategyId) as ICellValidationStrategy;
                // first see if its an error = should only be one item in array if so
                if (failedRules[0].CellValidationMode == CellValidationMode.Prevent) {
                    let errorMessage: string = ObjectFactory.CreateCellValidationMessage(failedRules[0], this);
                    let error: IUIError = {
                        ErrorMsg: errorMessage
                    };
                    this.AdaptableBlotterStore.TheStore.dispatch<PopupRedux.PopupShowErrorAction>(PopupRedux.PopupShowError(error));
                    event.preventDefault();
                }
                else {
                    let warningMessage: string = "";
                    failedRules.forEach(f => {
                        warningMessage = warningMessage + ObjectFactory.CreateCellValidationMessage(f, this) + "\n";
                    });
                    let cellInfo: ICellInfo = {
                        Id: dataChangedEvent.IdentifierValue,
                        ColumnId: dataChangedEvent.ColumnId,
                        Value: dataChangedEvent.NewValue
                    };
                    let confirmation: IUIConfirmation = {
                        CancelText: "Cancel Edit",
                        ConfirmationTitle: "Cell Validation Failed",
                        ConfirmationMsg: warningMessage,
                        ConfirmationText: "Bypass Rule",
                        CancelAction: null,
                        ConfirmAction: GridRedux.SetValueLikeEdit(cellInfo, (row)[dataChangedEvent.ColumnId])
                    };
                    this.AdaptableBlotterStore.TheStore.dispatch<PopupRedux.PopupShowConfirmationAction>(PopupRedux.PopupShowConfirmation(confirmation));
                    //we prevent the save and depending on the user choice we will set the value to the edited value in the middleware
                    event.preventDefault();
                }
            }
            else {
                this.AuditLogService.AddEditCellAuditLog(dataChangedEvent.IdentifierValue, dataChangedEvent.ColumnId, (row)[dataChangedEvent.ColumnId], dataChangedEvent.NewValue);
            }
        });
        //We call Reindex so functions like CustomSort, Search and Filter are reapplied
        grid.addEventListener("fin-after-cell-edit", (e: any) => {
            this.grid.behavior.reindex();
        });
        this.sortOrder = SortOrder.Unknown;
        //this is used so the grid displays sort icon when sorting....
        grid.behavior.dataModel.getSortImageForColumn = (columnIndex: number) => {
            var icon = '';
            //we now store the displayed column index in the sortColumnGridIndex so no need to transpose the index
            // if (grid.properties.columnIndexes[columnIndex] == this.sortColumnGridIndex) {
            if (columnIndex == this.sortColumnGridIndex) {
                if (this.sortOrder == SortOrder.Ascending) {
                    icon = UPWARDS_BLACK_ARROW;
                }
                else if (this.sortOrder == SortOrder.Descending) {
                    icon = DOWNWARDS_BLACK_ARROW;
                }
            }
            return icon;
        };
        let originGetCell = grid.behavior.dataModel.getCell;
        grid.behavior.dataModel.getCell = (config: any, declaredRendererName: string) => {
            try {
                //we run the original one as we don't want it to override our styles. i.e. for ex background color for our flash
                let originalGetCellReturn: any
                if (originGetCell) {
                    //we need to maintain the context of the call
                    originalGetCellReturn = originGetCell.call(grid.behavior.dataModel, config, declaredRendererName)
                }
                if (config.isHeaderRow && !config.isHandleColumn) {
                    let filterIndex = this.AdaptableBlotterStore.TheStore.getState().Filter.ColumnFilters.findIndex(x => x.ColumnId == config.name);
                    config.value = [null, config.value, getFilterIcon(filterIndex >= 0)];
                }
                if (config.isDataRow) {
                    let row = config.dataRow;
                    let columnName = config.name;
                    if (columnName && row) {
                        //check that it doesn't impact perf monitor
                        let column = this.getHypergridColumn(columnName);
                        this.AuditService.CreateAuditEvent(this.getPrimaryKeyValueFromRecord(row), this.valOrFunc(row, column), columnName, row);
                    }
                    let primaryKey = this.getPrimaryKeyValueFromRecord(row);
                    let cellStyleHypergridColumns = this.cellStyleHypergridMap.get(primaryKey);
                    let cellStyleHypergrid = cellStyleHypergridColumns ? cellStyleHypergridColumns.get(columnName) : null;
                    if (cellStyleHypergrid) {
                        let flashColor = cellStyleHypergrid.flashBackColor;
                        let conditionalStyleColumn = cellStyleHypergrid.conditionalStyleColumn;
                        let conditionalStyleRow = cellStyleHypergrid.conditionalStyleRow;
                        let quickSearchBackColor = cellStyleHypergrid.quickSearchBackColor;
                        //Lowest priority first then every step will override the properties it needs to override.
                        //probably not needed to optimise as we just assign properties.......
                        if (conditionalStyleRow) {
                            if (conditionalStyleRow.BackColor) {
                                config.backgroundColor = conditionalStyleRow.BackColor;
                            }
                            if (conditionalStyleRow.ForeColor) {
                                config.color = conditionalStyleRow.ForeColor;
                            }
                            if (conditionalStyleRow.FontStyle
                                || conditionalStyleRow.FontWeight
                                || conditionalStyleRow.ForeColor
                                || conditionalStyleRow.FontSize) {
                                config.font = this.buildFontCSSShorthand(config.font, conditionalStyleRow);
                            }
                        }
                        if (conditionalStyleColumn) {
                            if (conditionalStyleColumn.BackColor) {
                                config.backgroundColor = conditionalStyleColumn.BackColor;
                            }
                            if (conditionalStyleColumn.ForeColor) {
                                config.color = conditionalStyleColumn.ForeColor;
                            }
                            if (conditionalStyleColumn.FontStyle
                                || conditionalStyleColumn.FontWeight
                                || conditionalStyleColumn.ForeColor
                                || conditionalStyleColumn.FontSize) {
                                config.font = this.buildFontCSSShorthand(config.font, conditionalStyleColumn);
                            }
                        }
                        if (quickSearchBackColor) {
                            config.backgroundColor = this.AdaptableBlotterStore.TheStore.getState().QuickSearch.QuickSearchBackColor;
                        }
                        if (flashColor) {
                            config.backgroundColor = flashColor;
                        }
                    }
                }

                return originalGetCellReturn || this.grid.cellRenderers.get(declaredRendererName);
            }
            catch (err) {
                console.error("Error during GetCell", err)
            }
        };
        grid.addEventListener('fin-column-sort', (e: any) => {
            this.toggleSort(e.detail.column);
            //in case we want multi column
            //keys =  event.detail.keys;
        });
        //We add our sorter pipe last into the existing pipeline
        let currentDataSources = grid.behavior.dataModel.DataSources;
        currentDataSources.push(FilterAndSearchDataSource(this));
        currentDataSources.push(CustomSortDataSource(this));
        grid.setPipeline(currentDataSources, {
            stash: 'default',
            apply: false //  Set the new pipeline without calling reindex. We might need to reindex.... Not sure yet
        });
        grid.addEventListener("fin-column-changed-event", () => {
            setTimeout(() => this.setColumnIntoStore(), 5);
        });
    }
}

export interface CellStyleHypergrid {
    conditionalStyleColumn?: IStyle,
    conditionalStyleRow?: IStyle,
    flashBackColor?: string,
    quickSearchBackColor?: boolean
}