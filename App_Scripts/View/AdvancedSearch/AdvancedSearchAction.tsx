import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import * as StrategyIds from '../../Core/StrategyIds'
import { Provider, connect } from 'react-redux';
import { Panel, FormControl, ControlLabel, Form, FormGroup, Button, OverlayTrigger, Row, Col, Tooltip } from 'react-bootstrap';
import { PanelWithButton } from '../Components/Panels/PanelWithButton';
import { PanelWithInfo } from '../Components/Panels/PanelWithInfo';
import { IColumn } from '../../Core/Interface/IAdaptableBlotter';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as AdvancedSearchRedux from '../../Redux/ActionsReducers/AdvancedSearchRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import { IAdvancedSearch } from '../../Core/Interface/IAdvancedSearchStrategy';
import { AdaptableWizard } from './..//Wizard/AdaptableWizard'
import { AdvancedSearchExpressionWizard } from './AdvancedSearchExpressionWizard'
import { AdvancedSearchSettingsWizard } from './AdvancedSearchSettingsWizard'
import { AdaptableBlotterForm } from '../AdaptableBlotterForm'
import { ExpressionHelper } from '../../Core/Expression/ExpressionHelper';
import { Helper } from '../../Core/Helper';
import { ObjectFactory } from '../../Core/ObjectFactory';
import { ExpressionBuilderPreview } from '../ExpressionBuilder/ExpressionBuilderPreview'
import { PopupState } from '../../Redux/ActionsReducers/Interface/IState'
import { IStrategyViewPopupProps } from '../../Core/Interface/IStrategyView'
import { IUserFilter } from '../../Core/Interface/IExpression'
import { IUIConfirmation } from '../../Core/Interface/IStrategy';
import { ButtonEdit } from '../Components/Buttons/ButtonEdit';
import { ButtonDelete } from '../Components/Buttons/ButtonDelete';
import { ButtonClear } from '../Components/Buttons/ButtonClear';
import { ButtonNew } from '../Components/Buttons/ButtonNew';

interface AdvancedSearchActionProps extends IStrategyViewPopupProps<AdvancedSearchActionComponent> {
    AdvancedSearches: IAdvancedSearch[];
    Columns: IColumn[];
    CurrentAdvancedSearchUid: string;
    onAddUpdateAdvancedSearch: (AdvancedSearch: IAdvancedSearch) => AdvancedSearchRedux.AdvancedSearchAddUpdateAction,
    onSelectAdvancedSearch: (SelectedSearchName: string) => AdvancedSearchRedux.AdvancedSearchSelectAction,
    UserFilters: IUserFilter[]
}

interface AdvancedSearchActionInternalState {
    EditedAdvancedSearch: IAdvancedSearch
    //Jo: not sure I understand the goal of this property on the state. 
    SelectedColumnId: string
}

class AdvancedSearchActionComponent extends React.Component<AdvancedSearchActionProps, AdvancedSearchActionInternalState> {
    constructor(props: AdvancedSearchActionProps) {
        super(props);
        this.state = { EditedAdvancedSearch: null, SelectedColumnId: "" };
    }

    componentDidMount() {
        if (this.props.PopupParams == "New") {
            this.onNewAdvancedSearch()
        }
        if (this.props.PopupParams == "Edit") {
            this.onEditAdvancedSearch()
        }
    }

    private getClonedSelectedAdvancedSearch() {
        //we clone the object since there are methods that change directly the object from the state and 
        //I'm rewrtting enough of the component like that
        let selectedAdvancedSearch: IAdvancedSearch = this.props.AdvancedSearches.find(a => a.Uid == this.props.CurrentAdvancedSearchUid);
        if (selectedAdvancedSearch) {
            selectedAdvancedSearch = Helper.cloneObject(selectedAdvancedSearch)
        }
        return selectedAdvancedSearch
    }

    render() {
        let infoBody: any[] = ["Build multi-column named searches by creating a Query - which will contain a selection of column values, filters and ranges.",<br/>,<br/>,
            "Created searches are available in the Advanced Search Toolbar dropdown in the Dashboard.",<br/>,<br/>,
            "Advanced Searches can be cleared (turned off but not deleted), edited or deleted in this form."]

             let detailsInfoBody: any[] = ["Stuff about details."]

        let advancedSearches = this.props.AdvancedSearches.map(x => {
            return <option value={x.Uid} key={x.Uid}>{x.Name}</option>
        })

        let selectedAdvancedSearch: IAdvancedSearch = this.getClonedSelectedAdvancedSearch();
        let selectedAdvancedSearchName: string = selectedAdvancedSearch == null ? "" : selectedAdvancedSearch.Name;

        let currentAdvancedSearch: string = selectedAdvancedSearch != null ? selectedAdvancedSearch.Uid : "select";
        let newSearchButton = <ButtonNew onClick={() => this.onNewAdvancedSearch()}
            overrideTooltip="Create New Advanced Search"
            DisplayMode="Glyph+Text" />
        let editSearchButton = <ButtonEdit onClick={() => this.onEditAdvancedSearch()}
            overrideTooltip="Edit Search"
            ConfigEntity={selectedAdvancedSearch}
            DisplayMode="Glyph+Text" />
        return (
            <div >
                <PanelWithButton bsStyle="primary" headerText="Advanced Search"
                    infoBody={infoBody}
                    button={newSearchButton} glyphicon={"search"}>
                    {/* The main Search selection form */}
                    <AdaptableBlotterForm horizontal>
                        <FormGroup controlId="formInlineName">
                            <Col xs={2}>
                                <ControlLabel>  Current: </ControlLabel>
                            </Col>
                            <Col xs={4}>
                                <FormControl componentClass="select" placeholder="select"
                                    value={currentAdvancedSearch}
                                    onChange={(x) => this.onSelectedSearchChanged(x)} >
                                    <option value="select" key="select">Select a Search</option>
                                    {advancedSearches}
                                </FormControl>
                            </Col>
                            <Col xs={6}>
                                <ButtonClear onClick={() => this.onClearAdvancedSearch()}
                                    overrideTooltip="Clear Search"
                                    overrideDisableButton={selectedAdvancedSearch == null}
                                    DisplayMode="Glyph+Text" />
                                {' '}
                                <ButtonEdit onClick={() => this.onEditAdvancedSearch()}
                                    overrideTooltip="Edit Search"
                                    overrideDisableButton={selectedAdvancedSearch == null}
                                    ConfigEntity={selectedAdvancedSearch}
                                    DisplayMode="Glyph+Text" />
                                {' '}
                                <ButtonDelete
                                    overrideTooltip="Delete Search"
                                    overrideDisableButton={selectedAdvancedSearch == null}
                                    ConfigEntity={selectedAdvancedSearch}
                                    DisplayMode="Glyph+Text"
                                    ConfirmAction={AdvancedSearchRedux.AdvancedSearchDelete(selectedAdvancedSearch)}
                                    ConfirmationMsg={"Are you sure you want to delete '" + selectedAdvancedSearchName + "'?"}
                                    ConfirmationTitle={"Delete Advanced Search"} />
                            </Col>
                        </FormGroup>
                    </AdaptableBlotterForm>
                    {/* Wizard for creating or ediiting searches */}
                    {this.state.EditedAdvancedSearch != null &&
                        <AdaptableWizard Steps={
                            [
                                <AdvancedSearchExpressionWizard
                                    ColumnList={this.props.Columns}
                                    UserFilters={this.props.UserFilters}
                                    SelectedColumnId={this.state.SelectedColumnId}
                                    getColumnValueDisplayValuePairDistinctList={this.props.getColumnValueDisplayValuePairDistinctList} />,
                                <AdvancedSearchSettingsWizard />
                            ]}
                            Data={this.state.EditedAdvancedSearch}
                            StepStartIndex={0}
                            onHide={() => this.onCloseWizard()}
                            onFinish={() => this.onFinishWizard()} >
                        </AdaptableWizard>}

                </PanelWithButton>

                {/* Search details screen - showing contents of current selected search (only visible if there is one) */}
                {selectedAdvancedSearch != null &&

                    <PanelWithInfo bsStyle="primary" bsSize="small" header="Search Details" infoBody={detailsInfoBody} >
                        <div style={previewDivStyle}>
                            <ExpressionBuilderPreview Expression={selectedAdvancedSearch.Expression}
                                UserFilters={this.props.UserFilters}
                                onSelectedColumnChange={(columnName) => this.onSelectedColumnChange(columnName)}
                                SelectedColumnId={this.state.SelectedColumnId}
                                ColumnsList={this.props.Columns}
                                DeleteColumnValue={(columnId: string, value: any) => this.onDeleteColumnValue(columnId, value)}
                                DeleteUserFilterExpression={(columnId: string, index: number) => this.onDeleteUserFilterExpression(columnId, index)}
                                DeleteRange={(columnId: string, index: number) => this.onDeleteRange(columnId, index)}
                                ShowPanel={false}
                                ReadOnlyMode={selectedAdvancedSearch.IsPredefined}>
                            </ExpressionBuilderPreview>
                        </div>
                    </PanelWithInfo>

                }

            </div>
        );
    }

    // New search: sets the edited search to a new blank search which will force the wizard to show
    onNewAdvancedSearch() {
        this.setState({ EditedAdvancedSearch: ObjectFactory.CreateEmptyAdvancedSearch(), SelectedColumnId: "" } as AdvancedSearchActionInternalState)
    }

    // Edit search: sets the edited search to the current selected search which will force the wizard to show
    onEditAdvancedSearch() {
        let clonedSearch: IAdvancedSearch = this.getClonedSelectedAdvancedSearch();
        this.setState({ EditedAdvancedSearch: clonedSearch } as AdvancedSearchActionInternalState)
    }

    // Clear search:  sets the edited and selected searches to null and calles Redux Select Advanced Search
    onClearAdvancedSearch() {
        this.props.onSelectAdvancedSearch("");
    }

    onDeleteColumnValue(columnId: string, value: any) {
        let clonedSearch: IAdvancedSearch = this.getClonedSelectedAdvancedSearch();
        let columnValues = clonedSearch.Expression.ColumnDisplayValuesExpressions.find(x => x.ColumnName == columnId)
        let index = columnValues.ColumnValues.indexOf(value)
        columnValues.ColumnValues.splice(index, 1)
        if (columnValues.ColumnValues.length == 0) {
            let columnValuesIndex = clonedSearch.Expression.ColumnDisplayValuesExpressions.findIndex(x => x.ColumnName == columnId)
            clonedSearch.Expression.ColumnDisplayValuesExpressions.splice(columnValuesIndex, 1)
        }
        this.props.onAddUpdateAdvancedSearch(clonedSearch);
    }

    onDeleteUserFilterExpression(columnId: string, index: number) {
        let clonedSearch: IAdvancedSearch = this.getClonedSelectedAdvancedSearch();
        let columnUserFilterExpressions = clonedSearch.Expression.UserFilters.find(x => x.ColumnName == columnId)
        columnUserFilterExpressions.UserFilterUids.splice(index, 1)
        if (columnUserFilterExpressions.UserFilterUids.length == 0) {
            let columnUserFilterExpressionIndex = clonedSearch.Expression.UserFilters.findIndex(x => x.ColumnName == columnId)
            clonedSearch.Expression.UserFilters.splice(columnUserFilterExpressionIndex, 1)
        }
        this.props.onAddUpdateAdvancedSearch(clonedSearch);
    }

    onDeleteRange(columnId: string, index: number) {
        let clonedSearch: IAdvancedSearch = this.getClonedSelectedAdvancedSearch();
        let columnRanges = clonedSearch.Expression.RangeExpressions.find(x => x.ColumnName == columnId)
        columnRanges.Ranges.splice(index, 1)
        if (columnRanges.Ranges.length == 0) {
            let columnRangesIndex = clonedSearch.Expression.RangeExpressions.findIndex(x => x.ColumnName == columnId)
            clonedSearch.Expression.RangeExpressions.splice(columnRangesIndex, 1)
        }
        this.props.onAddUpdateAdvancedSearch(clonedSearch);
    }

    onSelectedColumnChange(columnName: string) {
        let clonedSearch: IAdvancedSearch = this.getClonedSelectedAdvancedSearch();
        this.setState({ SelectedColumnId: columnName, EditedAdvancedSearch: clonedSearch } as AdvancedSearchActionInternalState)
    }

    onCloseWizard() {
        this.props.onClearPopupParams()
        this.setState({ EditedAdvancedSearch: null } as AdvancedSearchActionInternalState)
    }

    onFinishWizard() {
        let clonedObject: IAdvancedSearch = Helper.cloneObject(this.state.EditedAdvancedSearch);
        this.props.onAddUpdateAdvancedSearch(clonedObject);
    }

    onSelectedSearchChanged(event: React.FormEvent<any>) {
        let e = event.target as HTMLInputElement;
        if (e.value == "select") {
            this.onClearAdvancedSearch();
        } else {
            this.props.onSelectAdvancedSearch(e.value);
        }
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        AdvancedSearches: state.AdvancedSearch.AdvancedSearches,
        CurrentAdvancedSearchUid: state.AdvancedSearch.CurrentAdvancedSearchId,
        Columns: state.Grid.Columns,
        UserFilters: state.Filter.UserFilters
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onAddUpdateAdvancedSearch: (advancedSearch: IAdvancedSearch) => dispatch(AdvancedSearchRedux.AdvancedSearchAddUpdate(advancedSearch)),
        onSelectAdvancedSearch: (selectedSearchName: string) => dispatch(AdvancedSearchRedux.AdvancedSearchSelect(selectedSearchName)),
    };
}

export let AdvancedSearchAction = connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchActionComponent);

var divStyle = {
    overflowY: 'auto',
    maxHeight: '400px',
    margin: '6px'
};

var previewDivStyle : React.CSSProperties = {
    overflowY: 'auto',
    maxHeight: '350px',
};

let smallButtonStyle = {
    margin: '2px'
}