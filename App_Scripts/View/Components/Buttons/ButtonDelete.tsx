import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { Helper } from '../../../Core/Helper'
import { AdaptableBlotterState } from '../../../Redux/Store/Interface/IAdaptableStore'
import { Button, OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap';
import { IUIError } from '../../../Core/Interface/IStrategy';
import { IConfigEntity } from '../../../Core/Interface/IAdaptableBlotter';
import * as PopupRedux from '../../../Redux/ActionsReducers/PopupRedux'
import { ButtonBase, ButtonProps } from './ButtonBase'
import { IUIConfirmation } from '../../../Core/Interface/IStrategy';

export interface DeleteButtonProps extends ButtonProps {
    onConfirmWarning?: (confirmation: IUIConfirmation) => PopupRedux.PopupShowConfirmationAction
    ConfirmAction: Redux.Action
    ConfirmationMsg: string
    ConfirmationTitle: string
}

class ButtonDeleteComponent extends React.Component<DeleteButtonProps, {}> {
    render() {

        return <ButtonBase ToolTipAndText="Delete"
            bsStyle='danger'
            bsSize={this.props.size}
             ConfigEntity={this.props.ConfigEntity}
            glyph="trash"
            onClick={() => this.onClick()}
            overrideDisableButton={this.props.overrideDisableButton}
            overrideTooltip={this.props.overrideTooltip}
            style={this.props.style}
            DisplayMode={this.props.DisplayMode}
            overrideText={this.props.overrideText}
        />;
    }

    onClick() {
        let confirmation: IUIConfirmation = {
            CancelText: "Cancel",
            ConfirmationTitle: this.props.ConfirmationTitle,
            ConfirmationMsg: this.props.ConfirmationMsg,
            ConfirmationText: "Delete",
            CancelAction: null,
            ConfirmAction: this.props.ConfirmAction
        }
        this.props.onConfirmWarning(confirmation)
    }
}

//Here we bypass slightly how the whole thing works and consider Delete as a smart component that will show the warning 
//Purist will say that we should pass in everything we need through the props but I don't think it's really needed in that case
//and it makes the component where we use the DeleteButton slighlty less verbos
function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        ConfirmAction: ownProps.ConfirmAction,
        ConfirmationMsg: ownProps.ConfirmationMsg,
        ConfirmationTitle: ownProps.ConfirmationTitle
    };
}
// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onConfirmWarning: (confirmation: IUIConfirmation) => dispatch(PopupRedux.PopupShowConfirmation(confirmation)),
    };
}

export let ButtonDelete = connect<{}, {}, DeleteButtonProps>(mapStateToProps, mapDispatchToProps)(ButtonDeleteComponent);