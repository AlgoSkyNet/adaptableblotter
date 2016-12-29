import { IShortcut } from '../../Core/Interface/IShortcutStrategy';
/// <reference path="../../typings/index.d.ts" />

import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { Col, Panel, Row, Checkbox, FormControl } from 'react-bootstrap';
import { ColumnType } from '../../Core/Enums'
import { IFlashingColumn, IFlashingCellDuration } from '../../Core/Interface/IFlashingCellsStrategy';
import { IColumn } from '../../Core/Interface/IAdaptableBlotter';
import { EnumExtensions } from '../../Core/Extensions';

interface FlashingCellConfigItemProps extends React.ClassAttributes<FlashingCellConfigItem> {
    FlashingColumn: IFlashingColumn;
    Columns: IColumn[];
    FlashingCellDurations: IFlashingCellDuration[];
    onSelect: (flashingColumn: IFlashingColumn) => void;
    onChangeFlashingDuration: (flashingColumn: IFlashingColumn, NewFlashDuration: IFlashingCellDuration) => void;
    onChangeDownColorFlashingColumn: (flashingCell: IFlashingColumn, DownColor: string) => void;
    onChangeUpColorFlashingColumn: (flashingCell: IFlashingColumn, UpColor: string) => void;
}

export class FlashingCellConfigItem extends React.Component<FlashingCellConfigItemProps, {}> {

    render(): any {
        return <li
            className="list-group-item"
            onClick={() => { } }>
            <Row style={{ display: "flex", alignItems: "center" }}>
                <Col md={1} >
                    <Checkbox onChange={() => this.props.onSelect(this.props.FlashingColumn)} checked={this.props.FlashingColumn.IsLive}></Checkbox>
                </Col>
                <Col md={4} >
                    {this.props.Columns.find(f => f.ColumnId == this.props.FlashingColumn.ColumnName).ColumnFriendlyName}
                </Col>
                <Col md={3} >
                    {
                        <FormControl componentClass="select" value={this.props.FlashingColumn.FlashingCellDuration.Name} onChange={(x) => this.onActionChange(x)} >
                            {
                                this.props.FlashingCellDurations.map((flashingCellDuration: IFlashingCellDuration) => {
                                    return <option key={flashingCellDuration.Name} value={flashingCellDuration.Name}>{flashingCellDuration.Name}</option>
                                })
                            }
                        </FormControl>
                    }
                </Col>
                <Col md={2} >
                    <FormControl type="color" style={{ width: '40px' }} value={this.props.FlashingColumn.DownBackColor} onChange={(x) => this.onDownColorChange(x)} />
                </Col>
                <Col md={2} >
                    <FormControl type="color" style={{ width: '40px' }} value={this.props.FlashingColumn.UpBackColor} onChange={(x) => this.onUpColorChange(x)} />
                </Col>
            </Row>
        </li>
    }


    onActionChange(event: React.FormEvent) {
        let e = event.target as HTMLInputElement;
        this.props.onChangeFlashingDuration(this.props.FlashingColumn, this.props.FlashingCellDurations.find(f => f.Name == e.value));
    }

    onDownColorChange(event: React.FormEvent) {
        let e = event.target as HTMLInputElement;
        this.props.onChangeDownColorFlashingColumn(this.props.FlashingColumn, e.value);
    }

    onUpColorChange(event: React.FormEvent) {
        let e = event.target as HTMLInputElement;
        this.props.onChangeUpColorFlashingColumn(this.props.FlashingColumn, e.value);
    }
}


interface FlashingCellConfigHeaderProps extends React.ClassAttributes<FlashingCellConfigHeader> {
}

export class FlashingCellConfigHeader extends React.Component<FlashingCellConfigHeaderProps, {}> {
    render(): any {
        return <Panel style={panelHeaderStyle} >
            <Row >
                <Col md={1} style={headerStyle}>Live</Col>
                <Col md={4} style={headerStyle}>Column Name</Col>
                <Col md={3} style={headerStyle}>Flash Duration</Col>
                <Col md={2} style={headerStyle}>Down Color</Col>
                <Col md={2} style={headerStyle}>Up Color</Col>
            </Row>
        </Panel>
    }
}

var headerStyle: React.CSSProperties = {
    wordWrap: 'break-word',
    fontWeight: 'bold'
};

let panelHeaderStyle: React.CSSProperties = {
    marginBottom: '0px'
}
