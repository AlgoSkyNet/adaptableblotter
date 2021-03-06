import { IStrategy } from './IStrategy';

export interface IDashboardStrategy extends IStrategy {
}


export interface IDashboardStrategyControlConfiguration {
    Strategy: string
    IsVisible: boolean;
    IsCollapsed: boolean;
    ControlConfiguration?: any;
}