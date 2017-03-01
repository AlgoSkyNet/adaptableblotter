/// <reference path="../../typings/index.d.ts" />

import * as React from "react";
import * as Redux from "redux";
import { Helper } from '../Core/Helper'
import { PanelProps, Panel, Form, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { AdaptableBlotterForm } from './AdaptableBlotterForm'

interface PanelWithButtonProps extends PanelProps {
    buttonContent?: React.ReactNode;
    buttonClick?: () => void;
    headerText: string
    glyphicon?: string
    buttonDisabled?: boolean
    showAddButtonGlyph: boolean
}


//We cannot destructure this.props using the react way in typescript which is a real pain as you 
//need to transfer props individually as a consequence
//let { buttonContent, ...other } = this.props
export class PanelWithButton extends React.Component<PanelWithButtonProps, {}> {
    render() {
        let { buttonContent } = this.props
        let className = "panel-with-button"
        if (this.props.className) {
            className += " " + this.props.className
        }
        if (buttonContent) {
            className += " " + "panel-with-button-reduce-header-padding"
        }


        let header = <AdaptableBlotterForm inline>
            <Row style={{ display: "flex", alignItems: "center" }}>

                <Col xs={9}>
                    {this.props.glyphicon != null &&
                        <Glyphicon glyph={this.props.glyphicon} style={glyphBigRightMarginStyle} />
                    }
                    {this.props.headerText}
                </Col>
                <Col xs={3}>
                    {buttonContent &&




                        <Button bsSize="small" bsStyle={this.getButtonAddStyle()} disabled={this.props.buttonDisabled} onClick={() => this.props.buttonClick()} style={{ float: 'right' }}>

                            {buttonContent}
                        </Button>}
                </Col>
            </Row>
        </AdaptableBlotterForm>;
        return <Panel header={header} className={className} style={this.props.style} bsStyle={this.props.bsStyle}>
            {this.props.children}
        </Panel>;
    }

    private getButtonAddStyle(): string {
        // changed by JW but not sure about this so always using defaault...
        return this.props.showAddButtonGlyph ? "default" : "default"
    }

}

let glyphBigRightMarginStyle = {
    marginRight: '10px',
    padding: '0px'
}

let glyphSmallRightMarginStyle = {
    marginRight: '5px',
    padding: '0px'
}
