import { PlusMinusState } from './Interface/IState';
import { IPlusMinusCondition } from '../../Core/Interface/IPlusMinusStrategy';
import { Expression } from '../../Core/Expression/Expression';
import { ICellInfo } from '../../Core/Interface/IStrategy';
import * as Redux from 'redux'

export const PLUSMINUS_APPLY = 'PLUSMINUS_APPLY';
export const PLUSMINUS_SET_DEFAULT_NUDGE = 'PLUSMINUS_SET_DEFAULT_NUDGE';
export const PLUSMINUS_ADD_UPDATE_CONDITION = 'PLUSMINUS_ADD_UPDATE_CONDITION';
export const PLUSMINUS_EDIT_CONDITION = 'PLUSMINUS_EDIT_CONDITION';
export const PLUSMINUS_DELETE_CONDITION = 'PLUSMINUS_DELETE_CONDITION';

export interface PlusMinusApplyAction extends Redux.Action {
    CellInfos: ICellInfo[],
    KeyEventString: string,
}

export interface PlusMinusSetDefaultNudgeAction extends Redux.Action {
    value: number
}

export interface PlusMinusAddUpdateConditionAction extends Redux.Action {
    Index: number,
    PlusMinusCondition: IPlusMinusCondition
}

export interface PlusMinusEditConditionAction extends Redux.Action {
    Index: number,
    ColumnDefaultNudge: { ColumnId: string, DefaultNudge: number }
}

export interface PlusMinusDeleteConditionAction extends Redux.Action {
    Index: number
}

export const PlusMinusApply = (CellInfos: ICellInfo[], KeyEventString: string): PlusMinusApplyAction => ({
    type: PLUSMINUS_APPLY,
    CellInfos,
    KeyEventString,
})

export const PlusMinusSetDefaultNudge = (value: number): PlusMinusSetDefaultNudgeAction => ({
    type: PLUSMINUS_SET_DEFAULT_NUDGE,
    value
})

export const PlusMinusAddUpdateCondition = (Index: number, PlusMinusCondition: IPlusMinusCondition): PlusMinusAddUpdateConditionAction => ({
    type: PLUSMINUS_ADD_UPDATE_CONDITION,
    Index,
    PlusMinusCondition
})

export const PlusMinusEditCondition = (Index: number, ColumnDefaultNudge: { ColumnId: string, DefaultNudge: number }): PlusMinusEditConditionAction => ({
    type: PLUSMINUS_EDIT_CONDITION,
    Index,
    ColumnDefaultNudge
})

export const PlusMinusDeleteCondition = (Index: number): PlusMinusDeleteConditionAction => ({
    type: PLUSMINUS_DELETE_CONDITION,
    Index
})

const initialPlusMinusState: PlusMinusState = {
    DefaultNudge: 1,
    PlusMinusConditions: []
}

export const PlusMinusReducer: Redux.Reducer<PlusMinusState> = (state: PlusMinusState = initialPlusMinusState, action: Redux.Action): PlusMinusState => {
    switch (action.type) {
        case PLUSMINUS_APPLY:
            //we apply logic in the middleware since it's an API call
            return Object.assign({}, state)

        case PLUSMINUS_SET_DEFAULT_NUDGE:
            return Object.assign({}, state, { DefaultNudge: (<PlusMinusSetDefaultNudgeAction>action).value })

        case PLUSMINUS_ADD_UPDATE_CONDITION: {
            let actionTyped = (<PlusMinusAddUpdateConditionAction>action)
            let newCol: IPlusMinusCondition[] = [].concat(state.PlusMinusConditions)
            if (actionTyped.Index == -1) {
                newCol.push(actionTyped.PlusMinusCondition)
            }
            else {
                newCol[actionTyped.Index] = actionTyped.PlusMinusCondition
            }
            return Object.assign({}, state, { PlusMinusConditions: newCol })
        }

        case PLUSMINUS_EDIT_CONDITION: {
            let newCol: IPlusMinusCondition[] = [].concat(state.PlusMinusConditions)
            let actionTyped = (<PlusMinusEditConditionAction>action)
            let oldCondition = newCol[actionTyped.Index]
            newCol[actionTyped.Index] = Object.assign({}, oldCondition, { ColumnId: actionTyped.ColumnDefaultNudge.ColumnId, DefaultNudge: actionTyped.ColumnDefaultNudge.DefaultNudge })
            return Object.assign({}, state, { PlusMinusConditions: newCol })
        }

        case PLUSMINUS_DELETE_CONDITION: {
            let newCol: IPlusMinusCondition[] = [].concat(state.PlusMinusConditions)
            newCol.splice((<PlusMinusDeleteConditionAction>action).Index, 1)
            return Object.assign({}, state, { PlusMinusConditions: newCol })
        }
        default:
            return state
    }
}