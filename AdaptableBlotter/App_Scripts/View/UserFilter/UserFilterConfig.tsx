/// <reference path="../../../typings/index.d.ts" />

import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { Button, Form, FormGroup, Panel, ControlLabel, Row, Col, ButtonToolbar, OverlayTrigger, Tooltip, ListGroup, Well, Glyphicon } from 'react-bootstrap';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as UserFilterRedux from '../../Redux/ActionsReducers/UserFilterRedux'
import * as StrategyIds from '../../Core/StrategyIds'
import { IStrategyViewPopupProps } from '../../Core/Interface/IStrategyView'
import { IColumn } from '../../Core/Interface/IAdaptableBlotter';
import { Helper } from '../../Core/Helper';
import { AdaptableWizard } from './../Wizard/AdaptableWizard'
import { IUserFilter } from '../../Core/interface/IExpression';
import { ExpressionHelper } from '../../Core/Expression/ExpressionHelper';
import { PanelWithButton } from '../PanelWithButton';
import { EntityListActionButtons } from '../EntityListActionButtons';
import { ColumnType, ExpressionMode } from '../../Core/Enums'
import { IUserFilterStrategy } from '../../Core/Interface/IUserFilterStrategy';
import { IStrategy } from '../../Core/Interface/IStrategy';
import { UserFilterExpressionWizard } from './UserFilterExpressionWizard'
import { UserFilterSettingsWizard } from './UserFilterSettingsWizard'
import { StringExtensions } from '../../Core/Extensions';
import { PanelWithRow } from '../PanelWithRow';


interface UserFilterConfigProps extends IStrategyViewPopupProps<UserFilterConfigComponent> {
    UserFilters: IUserFilter[]
    Columns: IColumn[],
    onDeleteUserFilter: (userFilter: IUserFilter) => UserFilterRedux.UserFilterDeleteAction
    onAddEditUserFilter: (userFilter: IUserFilter) => UserFilterRedux.UserFilterAddOrUpdateAction
}

interface UserFilterConfigState {
    EditedUserFilter: IUserFilter
}

class UserFilterConfigComponent extends React.Component<UserFilterConfigProps, UserFilterConfigState> {

    constructor() {
        super();
        this.state = { EditedUserFilter: null }
    }

    render() {

        let selectedColumnId: string = "select";
        if (this.state.EditedUserFilter != null) {
            let editedColumn: string = ExpressionHelper.GetColumnIdForUserFilter(this.state.EditedUserFilter);
            if (StringExtensions.IsNotNullOrEmpty(editedColumn)) {
                selectedColumnId = editedColumn;
            }
        }

        let cellInfo: [string, number][] = [["Name", 4], ["Description", 5], ["", 3]];

        let UserFilterItems = this.props.UserFilters.filter(f => !f.IsPredefined).map((x) => {
            return <li
                className="list-group-item" key={x.Uid}>
                <Row >
                    <Col xs={4}>
                        {x.FriendlyName}
                    </Col>
                    <Col xs={5}>
                        {ExpressionHelper.ConvertExpressionToString(x.Expression, this.props.Columns, this.props.AdaptableBlotter)}
                    </Col>
                    <Col xs={3}>
                        <EntityListActionButtons
                            deleteClick={() => this.onDeleteUserFilter(x)}
                            editClick={() => this.onEditUserFilter(x)}>
                        </EntityListActionButtons>
                    </Col>
                </Row>
            </li>
        })

        return <PanelWithButton headerText="User Filters Configuration" bsStyle="primary" style={panelStyle}
            buttonContent={"Create User Filter"}
            buttonClick={() => this.onCreateUserFilter()}  >
            {UserFilterItems.length > 0 &&
                <div>
                    <PanelWithRow CellInfo={cellInfo} bsStyle="info" />
                    <ListGroup style={listGroupStyle}>
                        {UserFilterItems}
                    </ListGroup>
                </div>
            }

            {UserFilterItems.length == 0 &&
                <Well bsSize="small">Click 'Create Column Filter' to start creating column filters.</Well>
            }

            {this.state.EditedUserFilter != null &&
                <AdaptableWizard Steps={[
                    <UserFilterExpressionWizard
                        Blotter={this.props.AdaptableBlotter}
                        ColumnList={this.props.Columns}
                        ExpressionMode={ExpressionMode.SingleColumn}
                        SelectedColumnId={selectedColumnId} />,
                    <UserFilterSettingsWizard
                        Blotter={this.props.AdaptableBlotter}
                        Columns={this.props.Columns} />,
                ]}
                    Data={this.state.EditedUserFilter}
                    StepStartIndex={0}
                    onHide={() => this.closeWizard()}
                    onFinish={() => this.finishWizard()} ></AdaptableWizard>}
        </PanelWithButton>
    }

    onCreateUserFilter() {
        // have to use any as cannot cast from IStrategy to userFilterStrategy  :(
        let userFilterStrategy: any = this.props.AdaptableBlotter.Strategies.get(StrategyIds.UserFilterStrategyId);
        let emptyFilter: IUserFilter = userFilterStrategy.CreateEmptyUserFilter();
        this.setState({ EditedUserFilter: emptyFilter });
    }

    onEditUserFilter(userFilter: IUserFilter) {
        //we clone the condition as we do not want to mutate the redux state here....
        this.setState({ EditedUserFilter: Helper.cloneObject(userFilter) });
    }

    onDeleteUserFilter(userFilter: IUserFilter) {
        this.props.onDeleteUserFilter(userFilter);
    }

    closeWizard() {
        this.setState({ EditedUserFilter: null, });
    }

    finishWizard() {
        this.props.onAddEditUserFilter(this.state.EditedUserFilter);
        this.setState({ EditedUserFilter: null });
    }

}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        UserFilters: state.UserFilter.UserFilters,
        Columns: state.Grid.Columns
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onDeleteUserFilter: (userFilter: IUserFilter) => dispatch(UserFilterRedux.DeleteUserFilter(userFilter)),
        onAddEditUserFilter: (userFilter: IUserFilter) => dispatch(UserFilterRedux.AddEditUserFilter(userFilter))
    };
}

export let UserFilterConfig = connect(mapStateToProps, mapDispatchToProps)(UserFilterConfigComponent);

let listGroupStyle = {
    overflowY: 'auto',
    minHeight: '100px',
    maxHeight: '300px'
};

let panelStyle = {
    width: '800px'
}

var headerStyle: React.CSSProperties = {
    wordWrap: 'break-word',
    fontWeight: 'bold'
};

let panelHeaderStyle: React.CSSProperties = {
    marginBottom: '0px'
}