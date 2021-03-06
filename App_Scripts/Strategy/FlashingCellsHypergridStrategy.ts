import { FlashingCellsStrategy } from './FlashingCellsStrategy'
import { AdaptableBlotter } from '../Vendors/Hypergrid/AdaptableBlotter'
import { AdaptableStrategyBase } from '../Core/AdaptableStrategyBase'
import * as StrategyIds from '../Core/StrategyIds'
import { IMenuItem } from '../Core/Interface/IStrategy'
import { IAdaptableBlotter, IColumn } from '../Core/Interface/IAdaptableBlotter'
import { IFlashingCellsStrategy, IFlashingColumn, IFlashingCellDuration } from '../Core/Interface/IFlashingCellsStrategy'
import { IDataChangedEvent } from '../Core/Services/Interface/IAuditService'
import { FlashingCellState } from '../Redux/ActionsReducers/Interface/IState';
import { MenuType } from '../Core/Enums';
import * as FlashingCellsRedux from '../Redux/ActionsReducers/FlashingCellsRedux'

export class FlashingCellsHypergridStrategy extends FlashingCellsStrategy implements IFlashingCellsStrategy {
    constructor(private blotterBypass: AdaptableBlotter) {
        super(blotterBypass)
    }


    protected FlashCell(dataChangedEvent: IDataChangedEvent, flashingColumn: IFlashingColumn, index: number): void {
        if (dataChangedEvent.OldValue == null) { return; }
        var oldvalueNumber: Number = Number(dataChangedEvent.OldValue);
        var newValueNumber: Number = Number(dataChangedEvent.NewValue);

        var cellStyle: string = (oldvalueNumber > newValueNumber) ? flashingColumn.DownBackColor : flashingColumn.UpBackColor
        this.blotterBypass.addCellStyleHypergrid(dataChangedEvent.IdentifierValue, dataChangedEvent.ColumnId, { flashBackColor: cellStyle }, flashingColumn.FlashingCellDuration.Duration)
    }
}