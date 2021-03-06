import * as Redux from 'redux';
import { PopupState, IErrorPopup, IWarningPopup, IConfirmationPopup, IActionConfigurationPopup, IPromptPopup } from './Interface/IState';
import { IUIError, IUIWarning, IUIConfirmation, IUIPrompt, InputAction } from '../../Core/Interface/IStrategy';

const POPUP_SHOW = 'POPUP_SHOW';
const POPUP_HIDE = 'POPUP_HIDE';
const POPUP_HIDE_ERROR = 'POPUP_HIDE_ERROR';
const POPUP_HIDE_WARNING = 'POPUP_HIDE_WARNING';
const POPUP_HIDE_PROMPT = 'POPUP_HIDE_PROMPT';
export const POPUP_CONFIRM_PROMPT = 'POPUP_CONFIRM_PROMPT';
export const POPUP_CONFIRM_CONFIRMATION = 'POPUP_CONFIRM_CONFIRMATION';
export const POPUP_CANCEL_CONFIRMATION = 'POPUP_CANCEL_CONFIRMATION';
const POPUP_SHOW_ERROR = 'POPUP_SHOW_ERROR';
const POPUP_SHOW_WARNING = 'POPUP_SHOW_WARNING';
const POPUP_SHOW_PROMPT = 'POPUP_SHOW_PROMPT';
const POPUP_CONFIRMATION = 'POPUP_CONFIRMATION';
const POPUP_CLEAR_PARAM = 'POPUP_CLEAR_PARAM';

export interface PopupShowAction extends Redux.Action {
    ComponentClassName: string,
    IsReadOnly: boolean,
    Params?: string
}

export interface PopupHideAction extends Redux.Action { }

export interface PopupHideErrorAction extends Redux.Action { }

export interface PopupHideWarningAction extends Redux.Action { }

export interface PopupHidePromptAction extends Redux.Action { }

export interface PopupConfirmPromptAction extends InputAction { }

export interface PopupConfirmConfirmationAction extends Redux.Action { }

export interface PopupCancelConfirmationAction extends Redux.Action { }

export interface PopupShowErrorAction extends Redux.Action { Error: IUIError }

export interface PopupShowWarningAction extends Redux.Action { Warning: IUIWarning }

export interface PopupShowPromptAction extends Redux.Action { Prompt: IUIPrompt }

export interface PopupShowConfirmationAction extends Redux.Action { Confirmation: IUIConfirmation }

export interface PopupClearParamAction extends Redux.Action { }

export const PopupShow = (ComponentClassName: string, IsReadOnly?: boolean, Params?: string): PopupShowAction => ({
    type: POPUP_SHOW,
    ComponentClassName,
    IsReadOnly,
    Params
})

export const PopupHide = (): PopupHideAction => ({
    type: POPUP_HIDE
})

export const PopupHideError = (): PopupHideErrorAction => ({
    type: POPUP_HIDE_ERROR
})

export const PopupHideWarning = (): PopupHideWarningAction => ({
    type: POPUP_HIDE_WARNING
})

export const PopupHidePrompt = (): PopupHidePromptAction => ({
    type: POPUP_HIDE_PROMPT
})

export const PopupConfirmPrompt = (InputText: string): PopupConfirmPromptAction => ({
    type: POPUP_CONFIRM_PROMPT,
    InputText
})

export const PopupConfirmConfirmation = (): PopupConfirmConfirmationAction => ({
    type: POPUP_CONFIRM_CONFIRMATION
})

export const PopupCancelConfirmation = (): PopupCancelConfirmationAction => ({
    type: POPUP_CANCEL_CONFIRMATION
})

export const PopupShowError = (Error: IUIError): PopupShowErrorAction => ({
    type: POPUP_SHOW_ERROR,
    Error
})

export const PopupShowWarning = (Warning: IUIWarning): PopupShowWarningAction => ({
    type: POPUP_SHOW_WARNING,
    Warning
})

export const PopupShowPrompt = (Prompt: IUIPrompt): PopupShowPromptAction => ({
    type: POPUP_SHOW_PROMPT,
    Prompt
})

export const PopupShowConfirmation = (Confirmation: IUIConfirmation): PopupShowConfirmationAction => ({
    type: POPUP_CONFIRMATION,
    Confirmation
})

export const PopupClearParam = (): PopupClearParamAction => ({
    type: POPUP_CLEAR_PARAM
})

const initialPopupState: PopupState = {
    ActionConfigurationPopup: {
        ShowPopup: false,
        ComponentClassName: "",
        IsReadOnly: false,
        Params: null
    },
    ErrorPopup: {
        ShowErrorPopup: false,
        ErrorMsg: ""
    },
    WarningPopup: {
        ShowWarningPopup: false,
        WarningMsg: ""
    },
    ConfirmationPopup: {
        ShowConfirmationPopup: false,
        ConfirmationMsg: "",
        ConfirmationTitle: "",
        ConfirmationText: "",
        CancelText: "",
        CancelAction: null,
        ConfirmAction: null
    },
    PromptPopup: {
        ShowPromptPopup: false,
        PromptTitle: "",
        PromptMsg: "",
        ConfirmAction: null
    }
}

export const ShowPopupReducer: Redux.Reducer<PopupState> = (state: PopupState = initialPopupState, action: Redux.Action): PopupState => {
    switch (action.type) {
        case POPUP_SHOW: {
            let actionTypedShowPopup = (<PopupShowAction>action)
            let newActionConfigurationPopup: IActionConfigurationPopup = { ShowPopup: true, IsReadOnly: actionTypedShowPopup.IsReadOnly, ComponentClassName: actionTypedShowPopup.ComponentClassName, Params: actionTypedShowPopup.Params }
            return Object.assign({}, state, { ActionConfigurationPopup: newActionConfigurationPopup })
        }
        case POPUP_HIDE: {
            let newActionConfigurationPopup: IActionConfigurationPopup = { ShowPopup: false, IsReadOnly: false, ComponentClassName: "", Params: null }
            return Object.assign({}, state, { ActionConfigurationPopup: newActionConfigurationPopup })
        }
        case POPUP_HIDE_ERROR: {
            let newErrorPopup: IErrorPopup = { ShowErrorPopup: false, ErrorMsg: "" }
            return Object.assign({}, state, { ErrorPopup: newErrorPopup })
        }
        case POPUP_HIDE_WARNING: {
            let newWarningPopup: IWarningPopup = { ShowWarningPopup: false, WarningMsg: "" }
            return Object.assign({}, state, { WarningPopup: newWarningPopup })
        }
        case POPUP_HIDE_PROMPT: {
            let newPromptPopup: IPromptPopup = { ShowPromptPopup: false, PromptTitle: "", PromptMsg: "", ConfirmAction: null }
            return Object.assign({}, state, { PromptPopup: newPromptPopup })
        }
        case POPUP_CONFIRM_PROMPT: {
            //we dispatch the Action of ConfirmAction in the middelware in order to keep the reducer pure
            let newPromptPopup: IPromptPopup = { ShowPromptPopup: false, PromptTitle: "", PromptMsg: "", ConfirmAction: null }
            return Object.assign({}, state, { PromptPopup: newPromptPopup })
        }

        case POPUP_CONFIRM_CONFIRMATION: {
            //we dispatch the Action of ConfirmAction in the middelware in order to keep the reducer pure
            let newConfirmationPopup: IConfirmationPopup = {
                ShowConfirmationPopup: false,
                ConfirmationMsg: "",
                ConfirmationTitle: "",
                ConfirmationText: "",
                CancelText: "",
                ConfirmAction: null,
                CancelAction: null
            }
            return Object.assign({}, state, { ConfirmationPopup: newConfirmationPopup })
        }
        case POPUP_CANCEL_CONFIRMATION: {
            //we dispatch the Action of CancelAction in the middelware in order to keep the reducer pure
            let newConfirmationPopup: IConfirmationPopup = {
                ShowConfirmationPopup: false,
                ConfirmationMsg: "",
                ConfirmationTitle: "",
                ConfirmationText: "",
                CancelText: "",
                ConfirmAction: null,
                CancelAction: null
            }
            return Object.assign({}, state, { ConfirmationPopup: newConfirmationPopup })
        }
        case POPUP_SHOW_ERROR: {
            let newErrorPopup: IErrorPopup = { ShowErrorPopup: true, ErrorMsg: (<PopupShowErrorAction>action).Error.ErrorMsg }
            return Object.assign({}, state, { ErrorPopup: newErrorPopup })
        }
        case POPUP_SHOW_WARNING: {
            let newWarningPopup: IWarningPopup = { ShowWarningPopup: true, WarningMsg: (<PopupShowWarningAction>action).Warning.WarningMsg }
            return Object.assign({}, state, { WarningPopup: newWarningPopup })
        }
        case POPUP_SHOW_PROMPT: {
            let actionTyped = (<PopupShowPromptAction>action)
            let newPromptPopup: IPromptPopup = {
                ShowPromptPopup: true,
                PromptTitle: actionTyped.Prompt.PromptTitle,
                PromptMsg: actionTyped.Prompt.PromptMsg,
                ConfirmAction: actionTyped.Prompt.ConfirmAction
            }
            return Object.assign({}, state, { PromptPopup: newPromptPopup })
        }
        case POPUP_CONFIRMATION: {
            let actionTyped = (<PopupShowConfirmationAction>action)
            let newConfirmationPopup: IConfirmationPopup = {
                ShowConfirmationPopup: true,
                ConfirmationMsg: actionTyped.Confirmation.ConfirmationMsg,
                ConfirmationTitle: actionTyped.Confirmation.ConfirmationTitle,
                ConfirmationText: actionTyped.Confirmation.ConfirmationText,
                CancelText: actionTyped.Confirmation.CancelText,
                ConfirmAction: actionTyped.Confirmation.ConfirmAction,
                CancelAction: actionTyped.Confirmation.CancelAction
            }
            return Object.assign({}, state, { ConfirmationPopup: newConfirmationPopup })
        }
        case POPUP_CLEAR_PARAM: {
            let newActionConfigurationPopup: IActionConfigurationPopup = { ShowPopup: state.ActionConfigurationPopup.ShowPopup, IsReadOnly: state.ActionConfigurationPopup.IsReadOnly, ComponentClassName: state.ActionConfigurationPopup.ComponentClassName, Params: null }
            return Object.assign({}, state, { ActionConfigurationPopup: newActionConfigurationPopup })
        }
        default:
            return state
    }
}