﻿/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import { Provider, connect } from 'react-redux';
import { Form, Panel, FormControl, ControlLabel, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { StringExtensions } from '../../Core/Extensions';
import { IStrategyViewPopupProps } from '../../Core/Interface/IStrategyView'
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import { IColumn } from '../../Core/Interface/IAdaptableBlotter';
import { ILayout } from '../../Core/Interface/ILayoutStrategy'
import * as LayoutRedux from '../../Redux/ActionsReducers/LayoutRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import { IUIPrompt, IUIConfirmation } from '../../Core/Interface/IStrategy';


interface LayoutToolbarControlComponentProps extends IStrategyViewPopupProps<LayoutToolbarControlComponent> {
    onLoadLayout: (layoutName: string) => LayoutRedux.LoadLayoutAction
    // onSaveLayout: (columns: IColumn[], layoutName: string) => LayoutRedux.SaveLayoutAction,
    onShowPrompt: (prompt: IUIPrompt) => PopupRedux.ShowPromptPopupAction,
     onConfirmWarning: (confirmation: IUIConfirmation) => PopupRedux.ShowConfirmationPopupAction,Columns: IColumn[],
    AvailableLayouts: ILayout[];
    CurrentLayout: string
}

class LayoutToolbarControlComponent extends React.Component<LayoutToolbarControlComponentProps, {}> {

    render(): any {

        let availableLayouts = this.props.AvailableLayouts.map((x, index) => {
            return <option value={x.Name} key={index}>{x.Name}</option>
        })

        return <Form className='navbar-form'>
            <Panel className="small-padding-panel" >
                <ControlLabel>Layout:</ControlLabel>
                {' '}<FormControl componentClass="select" placeholder="select"
                    value={this.props.CurrentLayout}
                    onChange={(x) => this.onSelectedLayoutChanged(x)} >
                    {availableLayouts}
                </FormControl>

                {' '}
                <OverlayTrigger overlay={<Tooltip id="tooltipEdit">Save a new Layout using the Blotter's current column order and visibility</Tooltip>}>
                    <Button bsSize='small' bsStyle='primary' onClick={() => this.onSaveNewLayoutClicked()}>Save As New</Button>
                </OverlayTrigger>
                {' '}
                <OverlayTrigger overlay={<Tooltip id="tooltipEdit">Delete Layout</Tooltip>}>
                    <Button bsSize='small' bsStyle='danger' disabled={this.props.CurrentLayout == "Default"} onClick={() => this.onDeleteLayoutClicked()}>Delete</Button>
                </OverlayTrigger>

            </Panel>
        </Form>
    }

   private onDeleteLayoutClicked() {

        let confirmation: IUIConfirmation = {
            CancelText: "Cancel",
            ConfirmationTitle: "Delete Layout",
            ConfirmationMsg: "Are you sure you want to delete '" + this.props.CurrentLayout + "'?",
            ConfirmationText: "Delete",
            CancelAction: null,
            ConfirmAction: LayoutRedux.DeleteLayout(this.props.CurrentLayout)
        }
        this.props.onConfirmWarning(confirmation)
    }

    private onSaveNewLayoutClicked() {
        let prompt: IUIPrompt = {
            PromptTitle: "Save New Layout",
            PromptMsg: "Please enter a layout name",
            ConfirmAction: LayoutRedux.SaveLayout(this.props.Columns.filter(c => c.Visible).map(x => x.ColumnId), "")
        }
        this.props.onShowPrompt(prompt)
    }

    private onSelectedLayoutChanged(event: React.FormEvent) {
        let e = event.target as HTMLInputElement;
        this.props.onLoadLayout(e.value);
    }

}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        CurrentLayout: state.Layout.CurrentLayout,
        AvailableLayouts: state.Layout.AvailableLayouts,
        Columns: state.Grid.Columns
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onLoadLayout: (layoutName: string) => dispatch(LayoutRedux.LoadLayout(layoutName)),
        onShowPrompt: (prompt: IUIPrompt) => dispatch(PopupRedux.ShowPromptPopup(prompt)),
         onConfirmWarning: (confirmation: IUIConfirmation) => dispatch(PopupRedux.ShowConfirmationPopup(confirmation)),
   };
}

export let LayoutToolbarControl = connect(mapStateToProps, mapDispatchToProps)(LayoutToolbarControlComponent);

var labelStyle = {
    marginRight: '3px'
};
