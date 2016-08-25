import {MenuItemShowPopup} from '../../Core/MenuItem'
import {AdaptableStrategyBase} from '../../Core/AdaptableStrategyBase'
import {AdaptableViewFactory} from '../../View/AdaptableViewFactory'
import * as StrategyIds from '../../Core/StrategyIds'
import {SmartEditOperation, ColumnType} from '../../Core/Enums'

import {IAdaptableBlotter} from '../../Core/Interface/IAdaptableBlotter'
import {ISmartEditStrategy,ISmartEditValueTuple,ISmartEditPreviewReturn} from '../../Core/Interface/ISmartEditStrategy'

export class SmartEditStrategy extends AdaptableStrategyBase implements ISmartEditStrategy {
    private menuItemConfig: IMenuItem;
    constructor(blotter: IAdaptableBlotter) {
        super(StrategyIds.SmartEditStrategyId, blotter)
        this.menuItemConfig = new MenuItemShowPopup("Smart Edit", this.Id, 'SmartEditAction');
    }

    public ApplySmartEdit(smartEditValue: number, smartEditOperation: SmartEditOperation) : void{
        let selectedCells = this.blotter.getSelectedCells();
        let values: ISmartEditValueTuple[] = [];
        let columnId: string;

        for (let pair of selectedCells.Selection) {
            for (var columnValuePair of pair[1]) {
                let newValue: number;
                switch (smartEditOperation) {
                    case SmartEditOperation.Sum:
                        newValue = Number(columnValuePair.value) + smartEditValue
                        break;
                    case SmartEditOperation.Ratio:
                        newValue = Number(columnValuePair.value) * smartEditValue
                        break;
                    case SmartEditOperation.Absolute:
                        newValue = smartEditValue
                        break;
                }
                this.blotter.setValue(pair[0], columnValuePair.columnID, newValue)

                columnId = columnValuePair.columnID;
            }
        }
    }

    public BuildPreviewValues(smartEditValue: number, smartEditOperation: SmartEditOperation): ISmartEditPreviewReturn {
        let selectedCells = this.blotter.getSelectedCells();
        let values: ISmartEditValueTuple[] = [];
        let columnId: string;
        //if no cells are selected
        if (selectedCells.Selection.size == 0) {
            return {
                Error: {
                    ErrorMsg: "You need to select some Cells"
                }
            }
        }
        //if no cells are selected
        if (selectedCells.Selection.size == 0) {
            return {
                Error: {
                    ErrorMsg: "You need to select some Cells"
                }
            }
        }
        for (let pair of selectedCells.Selection) {
            if (pair[1].length > 1) {
                return {
                    Error: {
                        ErrorMsg: "You need to select Cells from one column only"
                    }
                }
            }
            for (var columnValuePair of pair[1]) {
                if (this.blotter.getColumnType(columnValuePair.columnID) != ColumnType.Number) {
                    return {
                        Error: {
                            ErrorMsg: "You need to select Cells from numeric columns"
                        }
                    }

                }
                let newValue: number;
                switch (smartEditOperation) {
                    case SmartEditOperation.Sum:
                        newValue = Number(columnValuePair.value) + smartEditValue
                        break;
                    case SmartEditOperation.Ratio:
                        newValue = Number(columnValuePair.value) * smartEditValue
                        break;
                    case SmartEditOperation.Absolute:
                        newValue = smartEditValue
                        break;
                }
                values.push({ Id: pair[0], InitialValue: Number(columnValuePair.value), ComputedValue: newValue })

                columnId = columnValuePair.columnID;
            }
        }

        return {
            ActionReturn: {
                ColumnId: columnId,
                InitialValueLabel: this.blotter.getColumnHeader(columnId) + " Initial Value",
                ComputedValueLabel: this.blotter.getColumnHeader(columnId) + " Computed Value",
                Values: values
            }
        }
    }

    getMenuItems(): IMenuItem[] {
        return [this.menuItemConfig];
    }
}