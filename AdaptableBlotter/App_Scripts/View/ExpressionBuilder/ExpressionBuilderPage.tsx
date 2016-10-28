/// <reference path="../../../typings/index.d.ts" />

import * as React from "react";
import { IExpression } from '../../Core/Interface/IExpression'
import { ExpressionBuilderConditionSelector } from './ExpressionBuilderConditionSelector'
import { IColumn, IAdaptableBlotter } from '../../Core/Interface/IAdaptableBlotter';
import { ListGroupItem, ListGroup, Panel, Grid, Row, Col } from 'react-bootstrap';
import { AdaptableWizardStep, AdaptableWizardStepProps } from '../Wizard/Interface/IAdaptableWizard'
import { ExpressionString } from '../../Core/Expression/ExpressionString';
import { ExpressionBuilderPreview } from './ExpressionBuilderPreview'

interface ExpressionBuilderPageProps extends React.ClassAttributes<ExpressionBuilderPage> {
    ColumnList: Array<IColumn>
    Blotter: IAdaptableBlotter
}

export interface ExpressionBuilderPageState {
    Expression: ExpressionString
    SelectedColumnId: string
}

export class ExpressionBuilderPage extends React.Component<ExpressionBuilderPageProps, ExpressionBuilderPageState> implements AdaptableWizardStep {
    render() {
        return <Grid>
            <Row>
                <Col xs={9}>
                    <ExpressionBuilderConditionSelector ColumnsList={this.props.ColumnList}
                        Blotter={this.props.Blotter}
                        Expression={this.state.Expression}
                        onExpressionChange={(expression) => this.onChangeExpression(expression)}
                        onSelectedColumnChange={(columnName) => this.onSelectedColumnChange(columnName)}
                        SelectedColumnId={this.state.SelectedColumnId}>
                    </ExpressionBuilderConditionSelector>
                </Col>
                <Col xs={3}>
                    <ExpressionBuilderPreview Expression={this.state.Expression}
                        onSelectedColumnChange={(columnName) => this.onSelectedColumnChange(columnName)}
                        SelectedColumnId={this.state.SelectedColumnId}>
                    </ExpressionBuilderPreview>
                </Col>
            </Row>
        </Grid>
    }

    onChangeExpression(newExpression: ExpressionString) {
        this.setState({ Expression: newExpression } as ExpressionBuilderPageState)
    }

    onSelectedColumnChange(columnName: string) {
        this.setState({ SelectedColumnId: columnName } as ExpressionBuilderPageState)
    }

    OnSelectedValuesChange(newValues: Array<string>) {
        //this.setState({ SelectedValues: newValues } as CustomSortValuesWizardState, () => this.props.UpdateGoBackState())
    }

    public canNext(): boolean { return true; /*return this.state.SelectedValues.length > 0; */ }
    public canBack(): boolean { return true; /*return !this.state.IsEdit; */ }
    public Next(): void { /*this.props.Data.CustomSortItems = this.state.SelectedValues*/ }
    public Back(): void { }
    public StepName = "Build Expression"
}

let divStyle = {
    'overflowY': 'auto',
    'maxHeight': '300px'
}