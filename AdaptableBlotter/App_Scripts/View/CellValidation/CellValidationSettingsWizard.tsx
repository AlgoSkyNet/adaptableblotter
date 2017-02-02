/// <reference path="../../../typings/index.d.ts" />

import * as React from "react";
import { Col, Panel } from 'react-bootstrap';
import { IColumn, IAdaptableBlotter } from '../../Core/Interface/IAdaptableBlotter';
import { AdaptableWizardStep, AdaptableWizardStepProps } from './../Wizard/Interface/IAdaptableWizard'
import { ICellValidationRule } from '../../Core/interface/ICellValidationStrategy';
import { StringExtensions } from '../../Core/Extensions';
import { SelectionMode } from '../../Core/Enums';
import { SingleListBox } from '../SingleListBox'

interface CellValidationSettingsWizardProps extends AdaptableWizardStepProps<ICellValidationRule> {
    Blotter: IAdaptableBlotter
    Columns: Array<IColumn>
}
interface CellValidationSettingsWizardState {
    ColumnId: string
}

export class CellValidationSettingsWizard extends React.Component<CellValidationSettingsWizardProps, CellValidationSettingsWizardState> implements AdaptableWizardStep {
    constructor(props: CellValidationSettingsWizardProps) {
        super(props)
        this.state = {
            ColumnId: this.props.Data.ColumnId,
        }
    }

    render(): any {

        let selectedColumnValues: string[] = StringExtensions.IsNullOrEmpty(this.state.ColumnId) ? [] : [this.state.ColumnId];

        return <Panel header="Select a Column" bsStyle="primary">
            <SingleListBox style={divStyle}
                Values={this.props.Columns}
                UiSelectedValues={selectedColumnValues}
                DisplayMember="FriendlyName"
                ValueMember="ColumnId"
                SortMember="FriendlyName"
                onSelectedChange={(list) => this.onColumnSelectedChanged(list)}
                SelectionMode={SelectionMode.Single}>
            </SingleListBox>
        </Panel>
    }

    private onColumnSelectedChanged(selectedColumnValues: Array<any>) {
        this.setState({ ColumnId: selectedColumnValues[0] } as CellValidationSettingsWizardState, () => this.props.UpdateGoBackState())
    }

    public canNext(): boolean {
        return (StringExtensions.IsNotNullOrEmpty(this.state.ColumnId));
    }

    public canBack(): boolean { return true; }
    public Next(): void {
        this.props.Data.ColumnId = this.state.ColumnId;
    }

    public Back(): void { }
    public StepName = "Cell Validation Column "
}

let divStyle = {
    'overflowY': 'auto',
    'height': '400px',
    'marginBottom': '0'
}