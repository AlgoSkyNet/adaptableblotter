import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { AdaptableBlotterState } from '../Redux/Store/Interface/IAdaptableStore';
import * as UserFilterRedux from '../Redux/ActionsReducers/FilterRedux'
import { FilterState } from '../Redux/ActionsReducers/Interface/IState';
import { IColumn, IRawValueDisplayValuePair } from '../Core/Interface/IAdaptableBlotter';
import { PanelWithButton } from './Components/Panels/PanelWithButton';
import { IColumnFilter, IColumnFilterContext, IColumnFilterItem } from '../Core/Interface/IFilterStrategy';
import { ExpressionHelper } from '../Core/Expression/ExpressionHelper';
import { UserFilterHelper } from '../Core/Services/UserFilterHelper';
import { DataType, SortOrder, DistinctCriteriaPairValue } from '../Core/Enums';
import { Expression } from '../Core/Expression/Expression'
import { IUserFilter } from '../Core/Interface/IExpression'
import { Helper } from '../Core/Helper'
import { ListBoxFilterForm } from './ListBoxFilterForm'
import { IStrategyViewPopupProps } from '../Core/Interface/IStrategyView'
import { ButtonClose } from './Components/Buttons/ButtonClose';


interface FilterFormProps extends IStrategyViewPopupProps<FilterFormComponent> {
    CurrentColumn: IColumn;
    FilterState: FilterState;
    onDeleteColumnFilter: (columnFilter: IColumnFilter) => UserFilterRedux.ColumnFilterDeleteAction
    onAddEditColumnFilter: (columnFilter: IColumnFilter) => UserFilterRedux.ColumnFilterAddUpdateAction
    ColumnValueType: DistinctCriteriaPairValue,
    onHideFilterForm: () => UserFilterRedux.HideFilterFormAction
}

class FilterFormComponent extends React.Component<FilterFormProps, {}> {

    render(): any {

        // get user filter expressions appropriate for this column
        let userFilters: IUserFilter[] = this.props.FilterState.UserFilters.filter(u => UserFilterHelper.ShowUserFilterForColumn(this.props.FilterState.UserFilters, u.Uid, this.props.CurrentColumn));
        let userFilterItems: IRawValueDisplayValuePair[] = userFilters.map((uf, index) => { return { RawValue: uf.Uid, DisplayValue: uf.FriendlyName } })

        let columnValuePairs: Array<IRawValueDisplayValuePair>
        // get the values for the column and then sort by raw value
        columnValuePairs = this.props.getColumnValueDisplayValuePairDistinctList(this.props.CurrentColumn.ColumnId, this.props.ColumnValueType);
        columnValuePairs = Helper.sortArrayWithProperty(SortOrder.Ascending, columnValuePairs, DistinctCriteriaPairValue[DistinctCriteriaPairValue.RawValue])

        // for boolean columns dont show any column values as we already have true/false from user filters
        if (this.props.CurrentColumn.DataType == DataType.Boolean) {
            columnValuePairs = [];
        }

        let existingColumnFilter: IColumnFilter = this.props.CurrentColumn.DataType != DataType.Boolean && this.props.FilterState.ColumnFilters.find(cf => cf.ColumnId == this.props.CurrentColumn.ColumnId);
        let uiSelectedColumnValues: String[]
        if (this.props.ColumnValueType == DistinctCriteriaPairValue.RawValue) {
            uiSelectedColumnValues = existingColumnFilter && existingColumnFilter.Filter.ColumnRawValuesExpressions.length > 0 ? existingColumnFilter.Filter.ColumnRawValuesExpressions[0].ColumnValues : []
        }
        else if (this.props.ColumnValueType == DistinctCriteriaPairValue.DisplayValue) {
            uiSelectedColumnValues = existingColumnFilter && existingColumnFilter.Filter.ColumnDisplayValuesExpressions.length > 0 ? existingColumnFilter.Filter.ColumnDisplayValuesExpressions[0].ColumnValues : []
        }

        let newButton = <ButtonClose onClick={() => this.props.onHideFilterForm()}
            style={buttonCloseStyle}
            size={"xsmall"}
            overrideTooltip="Close"
            DisplayMode="Glyph" />

        return <PanelWithButton headerText={"Filter"} style={panelStyle} className="no-padding-panel small-padding-panel" bsStyle="info" button={newButton}>
            <ListBoxFilterForm ColumnValues={columnValuePairs}
                UiSelectedColumnValues={uiSelectedColumnValues}
                UiSelectedUserFilters={existingColumnFilter && existingColumnFilter.Filter.UserFilters.length > 0 ? existingColumnFilter.Filter.UserFilters[0].UserFilterUids : []}
                UserFilters={userFilterItems}
                onColumnValueSelectedChange={(list) => this.onClickColumValue(list)}
                onUserFilterSelectedChange={(list) => this.onClickUserFilter(list)}
                ColumnValueType={this.props.ColumnValueType}>
            </ListBoxFilterForm>
        </PanelWithButton>
    }

    onClickColumValue(columnValues: string[]) {
        let existingColumnFilter: IColumnFilter = this.props.FilterState.ColumnFilters.find(cf => cf.ColumnId == this.props.CurrentColumn.ColumnId);
        let userFilterUids = existingColumnFilter && existingColumnFilter.Filter.UserFilters.length > 0 ?
            existingColumnFilter.Filter.UserFilters[0].UserFilterUids : []

        let expression: Expression
        if (this.props.ColumnValueType == DistinctCriteriaPairValue.RawValue) {
            expression = ExpressionHelper.CreateSingleColumnExpression(this.props.CurrentColumn.ColumnId, [], columnValues, userFilterUids, [])
        }
        else if (this.props.ColumnValueType == DistinctCriteriaPairValue.DisplayValue) {
            expression = ExpressionHelper.CreateSingleColumnExpression(this.props.CurrentColumn.ColumnId, columnValues, [], userFilterUids, [])
        }
        let columnFilter: IColumnFilter = { ColumnId: this.props.CurrentColumn.ColumnId, Filter: expression };
        //delete if empty
        if (columnValues.length == 0 && userFilterUids.length == 0) {
            this.props.onDeleteColumnFilter(columnFilter);
            return
        } else {
            this.props.onAddEditColumnFilter(columnFilter);
        }
    }

    onClickUserFilter(userFilterUids: string[]) {

        let existingColumnFilter: IColumnFilter = this.props.FilterState.ColumnFilters.find(cf => cf.ColumnId == this.props.CurrentColumn.ColumnId);

        if (userFilterUids.find(s => s == "All")) {
            existingColumnFilter = null;
            userFilterUids = [];
        }
        let columnValues = existingColumnFilter && existingColumnFilter.Filter.ColumnDisplayValuesExpressions.length > 0 ?
            existingColumnFilter.Filter.ColumnDisplayValuesExpressions[0].ColumnValues : []

        let expression: Expression
        if (this.props.ColumnValueType == DistinctCriteriaPairValue.RawValue) {
            expression = ExpressionHelper.CreateSingleColumnExpression(this.props.CurrentColumn.ColumnId, [], columnValues, userFilterUids, [])
        }
        else if (this.props.ColumnValueType == DistinctCriteriaPairValue.DisplayValue) {
            expression = ExpressionHelper.CreateSingleColumnExpression(this.props.CurrentColumn.ColumnId, columnValues, [], userFilterUids, [])
        }
        let columnFilter: IColumnFilter = { ColumnId: this.props.CurrentColumn.ColumnId, Filter: expression };
        //delete if empty
        if (columnValues.length == 0 && userFilterUids.length == 0) {
            this.props.onDeleteColumnFilter(columnFilter);
            return
        } else {
            this.props.onAddEditColumnFilter(columnFilter);
        }
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        CurrentColumn: ownProps.CurrentColumn,
        FilterState: state.Filter
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onDeleteColumnFilter: (columnFilter: IColumnFilter) => dispatch(UserFilterRedux.ColumnFilterDelete(columnFilter)),
        onAddEditColumnFilter: (columnFilter: IColumnFilter) => dispatch(UserFilterRedux.ColumnFilterAddUpdate(columnFilter)),
        onHideFilterForm: () => dispatch(UserFilterRedux.HideFilterForm())
    };
}

export let FilterForm = connect(mapStateToProps, mapDispatchToProps)(FilterFormComponent);

export const FilterFormReact = (FilterContext: IColumnFilterContext) => <Provider store={FilterContext.Blotter.AdaptableBlotterStore.TheStore}>
    <FilterForm
        getColumnValueDisplayValuePairDistinctList={(columnId: string, distinctCriteria: DistinctCriteriaPairValue) => FilterContext.Blotter.getColumnValueDisplayValuePairDistinctList(columnId, distinctCriteria)}
        isGridPageable={() => FilterContext.Blotter.isGridPageable}
        Blotter={FilterContext.Blotter} CurrentColumn={FilterContext.Column} ColumnValueType={FilterContext.ColumnValueType} />
</Provider>;

let panelStyle = {
    width: '130px'
}


let buttonCloseStyle = {
    margin: '0px',
    padding: '0px'
}