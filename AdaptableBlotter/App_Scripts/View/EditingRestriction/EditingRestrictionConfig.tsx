/// <reference path="../../../typings/index.d.ts" />

import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { Button, Form, FormControl, Col, Panel, ListGroup, Row, Well } from 'react-bootstrap';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import { IStrategyViewPopupProps } from '../../Core/Interface/IStrategyView'
import { IEditingRestriction } from '../../Core/interface/IEditingRestrictionStrategy';
import { IColumn } from '../../Core/Interface/IAdaptableBlotter';
import * as StrategyIds from '../../Core/StrategyIds'
import * as EditingRestrictionRedux from '../../Redux/ActionsReducers/EditingRestrictionRedux'
import { Helper } from '../../Core/Helper';
import { ColumnType } from '../../Core/Enums';
import { PanelWithButton } from '../PanelWithButton';
import { EntityListActionButtons } from '../EntityListActionButtons';
import { PopupType, EditingRestrictionAction } from '../../Core/Enums'
import { IEditingRestrictionStrategy } from '../../Core/Interface/IEditingRestrictionStrategy';
import { IStrategy } from '../../Core/Interface/IStrategy';
import { PanelWithRow } from '../PanelWithRow';
import { AdaptableWizard } from './../Wizard/AdaptableWizard'
import { EditingRestrictionSettingsWizard } from './EditingRestrictionSettingsWizard'
import { EditingRestrictionExpressionWizard } from './EditingRestrictionExpressionWizard'
import { StringExtensions, EnumExtensions } from '../../Core/Extensions';
import { ExpressionHelper } from '../../Core/Expression/ExpressionHelper';


interface EditingRestrictionConfigProps extends IStrategyViewPopupProps<EditingRestrictionConfigComponent> {
    EditingRestrictions: IEditingRestriction[];
    Columns: Array<IColumn>
    onDeleteEditingRestriction: (Index: number) => EditingRestrictionRedux.EditingRestrictionDeleteAction
    onAddEditEditingRestriction: (Index: number, EditingRestriction: IEditingRestriction) => EditingRestrictionRedux.EditingRestrictionAddOrUpdateAction
}

interface EditingRestrictionConfigState {
    EditedEditingRestriction: IEditingRestriction
    EditedIndexEditingRestriction: number
}

class EditingRestrictionConfigComponent extends React.Component<EditingRestrictionConfigProps, EditingRestrictionConfigState> {
    constructor() {
        super();
        this.state = { EditedEditingRestriction: null, EditedIndexEditingRestriction: -1 }
    }
    render() {

        let EditingRestrictionActionTypes = EnumExtensions.getNamesAndValues(EditingRestrictionAction).map((enumNameAndValue: any) => {
            return <option key={enumNameAndValue.value} value={enumNameAndValue.value}>{StringExtensions.PlaceSpaceBetweenCapitalisedWords(enumNameAndValue.name)}</option>
        })


        let cellInfo: [string, number][] = [["Column", 2], ["Restriction", 3], ["Expression", 3],["Action", 2], ["", 2]];

        let editingRestrictionItems = this.props.EditingRestrictions.map((x, index) => {
            return <li
                className="list-group-item" key={index}>
                <Row >
                    <Col xs={2}>
                        {this.props.Columns.find(c=>c.ColumnId == x.ColumnId).FriendlyName }
                    </Col>
                     <Col xs={3}>
                        {x.Description}
                    </Col>
                    <Col xs={3}>
                        {this.setExpressionDescription(x) }
                    </Col>
                    <Col xs={2}>
                        <FormControl componentClass="select" placeholder="select" value={x.EditingRestrictionAction.toString()} onChange={(x) => this.onEditingRestrictionActionChanged(index, x)} >
                            {EditingRestrictionActionTypes}
                        </FormControl>

                    </Col>
                    <Col xs={2}>
                        <EntityListActionButtons
                            deleteClick={() => this.props.onDeleteEditingRestriction(index)}
                            editClick={() => this.onEdit(index, x)}>
                        </EntityListActionButtons>
                    </Col>
                </Row>
            </li>
        })
        return <PanelWithButton headerText="Editing Restrictions Configuration" bsStyle="primary" style={panelStyle}
            buttonContent={"Create Editing Restriction"}
            buttonClick={() => this.createEditingRestriction()}  >
            {editingRestrictionItems.length > 0 &&
                <div>
                    <PanelWithRow CellInfo={cellInfo} bsStyle="info" />
                    <ListGroup style={listGroupStyle}>
                        {editingRestrictionItems}
                    </ListGroup>
                </div>
            }

            {editingRestrictionItems.length == 0 &&
                <Well bsSize="small">Click 'Create Editing Restriction' to start creating editing restrictions.</Well>
            }

            {this.state.EditedEditingRestriction != null &&
                <AdaptableWizard Steps={[
                    <EditingRestrictionSettingsWizard Columns={this.props.Columns} Blotter={this.props.AdaptableBlotter} />,
                    <EditingRestrictionExpressionWizard ColumnList={this.props.Columns} Blotter={this.props.AdaptableBlotter} SelectedColumnId={null} />,
                ]}
                    Data={this.state.EditedEditingRestriction}
                    StepStartIndex={0}
                    onHide={() => this.closeWizard()}
                    onFinish={() => this.finishWizard()} ></AdaptableWizard>}

        </PanelWithButton>
    }

    createEditingRestriction() {
        let EditingRestrictionStrategy: IEditingRestrictionStrategy = this.props.AdaptableBlotter.Strategies.get(StrategyIds.EditingRestrictionStrategyId) as IEditingRestrictionStrategy;
        this.setState({ EditedEditingRestriction: EditingRestrictionStrategy.CreateEmptyEditingRestriction(), EditedIndexEditingRestriction: -1 });
    }

    onEdit(index: number, EditingRestriction: IEditingRestriction) {
        //we clone the condition as we do not want to mutate the redux state here....
        this.setState({ EditedEditingRestriction: Helper.cloneObject(EditingRestriction), EditedIndexEditingRestriction: index });
    }

    private onEditingRestrictionActionChanged(index: number, event: React.FormEvent) {
        let e = event.target as HTMLInputElement;
        let EditingRestriction: IEditingRestriction = this.props.EditingRestrictions[index];
        EditingRestriction.EditingRestrictionAction = Number.parseInt(e.value);
        this.props.onAddEditEditingRestriction(index, EditingRestriction);
    }

    closeWizard() {
        this.setState({ EditedEditingRestriction: null, EditedIndexEditingRestriction: -1 });
    }

    finishWizard() {
        this.props.onAddEditEditingRestriction(this.state.EditedIndexEditingRestriction, this.state.EditedEditingRestriction);
        this.setState({ EditedEditingRestriction: null, EditedIndexEditingRestriction: -1 });
    }

     setExpressionDescription(EditingRestriction: IEditingRestriction):string {
        return (EditingRestriction.HasOtherExpression) ?
            ExpressionHelper.ConvertExpressionToString(EditingRestriction.OtherExpression, this.props.Columns, this.props.AdaptableBlotter) :
            "No Expression";
    }


}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        Columns: state.Grid.Columns,
        EditingRestrictions: state.EditingRestriction.EditingRestrictions
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onDeleteEditingRestriction: (index: number) => dispatch(EditingRestrictionRedux.DeleteEditingRestriction(index)),
        onAddEditEditingRestriction: (index: number, EditingRestriction: IEditingRestriction) => dispatch(EditingRestrictionRedux.AddEditEditingRestriction(index, EditingRestriction))
    };
}

export let EditingRestrictionConfig = connect(mapStateToProps, mapDispatchToProps)(EditingRestrictionConfigComponent);

let listGroupStyle = {
    overflowY: 'auto',
    minHeight: '100px',
    maxHeight: '300px'
};

let panelStyle = {
    width: '800px'
}


