/// <reference path="../../../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { ButtonToolbar, Grid, FormControl, ControlLabel, Label, Panel, Form, FormGroup, Button, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { PanelWithButton } from '../PanelWithButton';
import { IColumn, IAdaptableBlotter } from '../../Core/Interface/IAdaptableBlotter';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as AdvancedSearchRedux from '../../Redux/ActionsReducers/AdvancedSearchRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import { IAdvancedSearch } from '../../Core/Interface/IAdvancedSearchStrategy';
import { AdaptableWizard } from './..//Wizard/AdaptableWizard'
import { AdvancedSearchExpressionWizard } from './AdvancedSearchExpressionWizard'
import { AdvancedSearchSettingsWizard } from './AdvancedSearchSettingsWizard'
import { ExpressionHelper } from '../../Core/Expression/ExpressionHelper';
import { Helper } from '../../Core/Helper';
import { ExpressionBuilderPreview } from '../ExpressionBuilder/ExpressionBuilderPreview'
import { PopupState } from '../../Redux/ActionsReducers/Interface/IState'


interface AdvancedSearchActionProps extends React.ClassAttributes<AdvancedSearchActionComponent> {
    AdvancedSearches: IAdvancedSearch[];
    Columns: IColumn[];
    AdaptableBlotter: IAdaptableBlotter;
    CurrentAdvancedSearchUid: string;
    onAddUpdateAdvancedSearch: (AdvancedSearch: IAdvancedSearch) => AdvancedSearchRedux.AdvancedSearchAddUpdateAction,
    onDeleteAdvancedSearch: (AdvancedSearch: IAdvancedSearch) => AdvancedSearchRedux.AdvancedSearchDeleteAction,
    onSelectAdvancedSearch: (SelectedSearchName: string) => AdvancedSearchRedux.AdvancedSearchSelectAction,
    onClearPopup: () => PopupRedux.ClearPopupAction,
}

interface AdvancedSearchActionInternalState {
    EditedAdvancedSearch: IAdvancedSearch
    SelectedAdvancedSearch: IAdvancedSearch
    SelectedColumnId: string
}

class AdvancedSearchActionComponent extends React.Component<AdvancedSearchActionProps, AdvancedSearchActionInternalState> {
    private IsDeleting: boolean = false;
    private DisplayedNew: boolean = false;

    constructor() {
        super();
        this.state = { EditedAdvancedSearch: null, SelectedAdvancedSearch: null, SelectedColumnId: "select" }
    }

    render() {

        var isNew: PopupState = this.props.AdaptableBlotter.AdaptableBlotterStore.TheStore.getState().Popup;


        this.IsDeleting = false;
        var blotter = this.props.AdaptableBlotter;

        let advancedSearches = this.props.AdvancedSearches.map(x => {
            return <option value={x.Name} key={x.Name}>{x.Name}</option>
        })

        this.onCheckSavedSearchName();

        let currentAdvancedSearch: string = this.state.SelectedAdvancedSearch != null ? this.state.SelectedAdvancedSearch.Name : "select";

        if (isNew.Params != null && !this.DisplayedNew) {
            this.onNewAdvancedSearch();
        }
        return (
            <div >
                <Form inline>
                    <PanelWithButton bsStyle="primary" headerText="Advanced Search" buttonContent={"New Search"}
                        buttonClick={() => this.onNewAdvancedSearch()} style={panelStyle}  >

                        {/* The main Search selection form */}
                        <div style={divStyle}>
                            <FormGroup controlId="formInlineName">
                                <Col xs={2}>
                                    <ControlLabel>Select: </ControlLabel>
                                </Col>
                                <Col xs={5}>
                                    <FormControl componentClass="select" placeholder="select"
                                        value={currentAdvancedSearch}
                                        onChange={(x) => this.onSelectedSearchChanged(x)} >
                                        <option value="select" key="select">Select a Search</option>
                                        {advancedSearches}
                                    </FormControl>
                                </Col>
                                <Col xs={5}>
                                    <OverlayTrigger overlay={<Tooltip id="tooltipClear">Clear Search</Tooltip>}>
                                        <Button bsSize='small' style={smallButtonStyle} disabled={this.state.SelectedAdvancedSearch == null} bsStyle='primary' onClick={() => this.onClearAdvancedSearch()}>Clear</Button>
                                    </OverlayTrigger>
                                    {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltipDelete">Delete Search</Tooltip>}>
                                        <Button bsSize='small' style={smallButtonStyle} disabled={this.state.SelectedAdvancedSearch == null} onClick={() => this.onDeleteAdvancedSearch()}>Delete</Button>
                                    </OverlayTrigger>
                                </Col>
                            </FormGroup>
                        </div>

                        {/* Wizard for creating or ediiting searches */}
                        {this.state.EditedAdvancedSearch != null &&
                            <AdaptableWizard Steps={
                                [
                                    <AdvancedSearchExpressionWizard
                                        ColumnList={this.props.Columns}
                                        Blotter={this.props.AdaptableBlotter}
                                        SelectedColumnId={this.state.SelectedColumnId} />,
                                    <AdvancedSearchSettingsWizard
                                        Columns={this.props.Columns}
                                        Blotter={this.props.AdaptableBlotter} />
                                ]}
                                Data={this.state.EditedAdvancedSearch}
                                StepStartIndex={0}
                                onHide={() => this.onCloseWizard()}
                                onFinish={() => this.onFinishWizard()} >
                            </AdaptableWizard>}

                    </PanelWithButton>

                    {/* Search details screen - showing contents of current selected search (only visible if there is one) */}
                    {this.state.SelectedAdvancedSearch != null &&

                        <PanelWithButton headerText="Search Details" bsStyle="primary" style={panelStyle}
                            buttonContent={"Edit Search"}
                            buttonClick={() => this.onEditAdvancedSearch()}>
                            <div style={previewDivStyle}>
                                <ExpressionBuilderPreview Expression={this.state.SelectedAdvancedSearch.Expression}
                                    onSelectedColumnChange={(columnName) => this.onSelectedColumnChange(columnName)}
                                    SelectedColumnId={this.state.SelectedColumnId}
                                    ColumnsList={this.props.Columns}
                                    DeleteColumnValue={(columnId: string, value: any) => this.onDeleteColumnValue(columnId, value)}
                                    DeleteFilter={(columnId: string, index: number) => this.onDeleteFilter(columnId, index)}
                                    DeleteRange={(columnId: string, index: number) => this.onDeleteRange(columnId, index)}
                                    ShowPanel={false}>
                                </ExpressionBuilderPreview>
                            </div>
                        </PanelWithButton>

                    }

                </Form>
            </div>
        );
    }

    // New search: sets the edited search to a new blank search which will force the wizard to show
    onNewAdvancedSearch() {
        let _newAdvancedSearch: IAdvancedSearch = {
            Uid: Helper.generateUid(),
            Name: "",
            Expression: ExpressionHelper.CreateEmptyExpression(),
        }
        this.DisplayedNew = true; // must be a better way but not sure what it is yet!
        this.setState({ EditedAdvancedSearch: _newAdvancedSearch, SelectedColumnId: "select" } as AdvancedSearchActionInternalState)
    }

    // Edit search: sets the edited search to the current selected search which will force the wizard to show
    onEditAdvancedSearch() {
        let clonedSearch: IAdvancedSearch = this.onCloneAdvancedSearch(this.state.SelectedAdvancedSearch);
        this.setState({ EditedAdvancedSearch: clonedSearch } as AdvancedSearchActionInternalState)
    }

    // Clear search:  sets the edited and selected searches to null and calles Redux Select Advanced Search
    onClearAdvancedSearch() {
        this.setState({ EditedAdvancedSearch: null, SelectedAdvancedSearch: null, SelectedColumnId: "select" });
        this.props.onSelectAdvancedSearch("");
    }

    // Delete search:  sets the selected search to null and calles Redux Delete Advanced Search
    onDeleteAdvancedSearch() {
        if (confirm("Are you sure you want to delete Advanced Search: '" + this.state.SelectedAdvancedSearch.Name + "'?")) {
            this.props.onDeleteAdvancedSearch(this.state.SelectedAdvancedSearch);
            this.setState({ SelectedAdvancedSearch: null } as AdvancedSearchActionInternalState)
        }
    }


    onDeleteColumnValue(columnId: string, value: any) {
        let columnValues = this.state.SelectedAdvancedSearch.Expression.ColumnValuesExpression.find(x => x.ColumnName == columnId)
        let index = columnValues.Values.indexOf(value)
        columnValues.Values.splice(index, 1)
        if (columnValues.Values.length == 0) {
            let columnValuesIndex = this.state.SelectedAdvancedSearch.Expression.ColumnValuesExpression.findIndex(x => x.ColumnName == columnId)
            this.state.SelectedAdvancedSearch.Expression.ColumnValuesExpression.splice(columnValuesIndex, 1)
        }
        this.onDeleteSearchExpressionItem();
    }

    onDeleteFilter(columnId: string, index: number) {
        let columnFilters = this.state.SelectedAdvancedSearch.Expression.FiltersExpression.find(x => x.ColumnName == columnId)
        columnFilters.Filters.splice(index, 1)
        if (columnFilters.Filters.length == 0) {
            let columnFiltersIndex = this.state.SelectedAdvancedSearch.Expression.FiltersExpression.findIndex(x => x.ColumnName == columnId)
            this.state.SelectedAdvancedSearch.Expression.FiltersExpression.splice(columnFiltersIndex, 1)
        }
        this.onDeleteSearchExpressionItem();
    }

    onDeleteRange(columnId: string, index: number) {
        let columnRanges = this.state.SelectedAdvancedSearch.Expression.RangeExpression.find(x => x.ColumnName == columnId)
        columnRanges.Ranges.splice(index, 1)
        if (columnRanges.Ranges.length == 0) {
            let columnRangesIndex = this.state.SelectedAdvancedSearch.Expression.RangeExpression.findIndex(x => x.ColumnName == columnId)
            this.state.SelectedAdvancedSearch.Expression.RangeExpression.splice(columnRangesIndex, 1)
        }
        this.onDeleteSearchExpressionItem();
    }

    onDeleteSearchExpressionItem(): void {
        this.IsDeleting = true;
        this.setState({ EditedAdvancedSearch: null } as AdvancedSearchActionInternalState)
        this.props.onAddUpdateAdvancedSearch(this.state.SelectedAdvancedSearch);
    }

    onSelectedColumnChange(columnName: string) {
        if (!this.IsDeleting) { // this gets called after deleting an item so dont want to open advanced search in those circumstances
            let clonedSearch: IAdvancedSearch = this.onCloneAdvancedSearch(this.state.SelectedAdvancedSearch);
            this.setState({ SelectedColumnId: columnName, EditedAdvancedSearch: clonedSearch } as AdvancedSearchActionInternalState)
        }
    }

    onCloseWizard() {

        this.setState({ EditedAdvancedSearch: null } as AdvancedSearchActionInternalState)
    }

    onFinishWizard() {
        let clonedObject: IAdvancedSearch = this.onCloneAdvancedSearch(this.state.EditedAdvancedSearch);
        this.props.onAddUpdateAdvancedSearch(clonedObject);
        this.setState({ SelectedAdvancedSearch: clonedObject } as AdvancedSearchActionInternalState)
    }

    onSelectedSearchChanged(event: React.FormEvent) {
        let e = event.target as HTMLInputElement;
        if (e.value == "select") {
            this.onClearAdvancedSearch();
        } else {
            let selectedAdvancedSearch: IAdvancedSearch = this.props.AdvancedSearches.find(a => a.Name == e.value);
            this.setState({ EditedAdvancedSearch: null, SelectedAdvancedSearch: selectedAdvancedSearch, SelectedColumnId: "select" });
            this.props.onSelectAdvancedSearch(selectedAdvancedSearch.Uid);
        }
    }

    onCheckSavedSearchName(): void {
        if (this.state.SelectedAdvancedSearch == null && this.props.CurrentAdvancedSearchUid != "") {
            let savedSearch: IAdvancedSearch = this.props.AdvancedSearches.find(s => s.Uid == this.props.CurrentAdvancedSearchUid);
            this.setState({ SelectedAdvancedSearch: savedSearch } as AdvancedSearchActionInternalState);
        }

    }

    // we have an issue with cloning at the moment where filter is lost so we are going to always clone here and then its just one place until I fix
    onCloneAdvancedSearch(objectToClone: IAdvancedSearch): IAdvancedSearch {
        let clonedObject: IAdvancedSearch = Helper.cloneObject(objectToClone);
        clonedObject.Expression.FiltersExpression = this.state.EditedAdvancedSearch.Expression.FiltersExpression;
        return clonedObject;
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        AdaptableBlotter: ownProps.AdaptableBlotter,
        AdvancedSearches: state.AdvancedSearch.AdvancedSearches,
        CurrentAdvancedSearchUid: state.AdvancedSearch.CurrentAdvancedSearchId,
        Columns: state.Grid.Columns
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onAddUpdateAdvancedSearch: (advancedSearch: IAdvancedSearch) => dispatch(AdvancedSearchRedux.AdvancedSearchAddUpdate(advancedSearch)),
        onDeleteAdvancedSearch: (advancedSearch: IAdvancedSearch) => dispatch(AdvancedSearchRedux.AdvancedSearchDelete(advancedSearch)),
        onSelectAdvancedSearch: (selectedSearchName: string) => dispatch(AdvancedSearchRedux.AdvancedSearchSelect(selectedSearchName)),
        onClearPopup: () => dispatch(PopupRedux.ClearPopup()),
    };
}

export let AdvancedSearchAction = connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchActionComponent);

var divStyle = {
    overflowY: 'auto',
    maxHeight: '400px',
    margin: '5px'
};

var previewDivStyle = {
    overflowY: 'auto',
    maxHeight: '350px',
};

let panelStyle = {
    width: '550px'
}


let smallButtonStyle = {
    margin: '2px'
}