import { IAdaptableBlotter, IColumn, IEntitlement } from './Interface/IAdaptableBlotter';
import { IStrategy, IMenuItem } from './Interface/IStrategy';
import { ICalendarService } from '../Core/Services/Interface/ICalendarService'
import { CalendarService } from '../Core/Services/CalendarService'
import { MenuType } from '../Core/Enums'
import { MenuItemShowPopup } from '../Core/MenuItem';
import { MenuState } from '../Redux/ActionsReducers/Interface/IState';
import * as MenuRedux from '../Redux/ActionsReducers/MenuRedux'

export abstract class AdaptableStrategyBase implements IStrategy {
    private menuIsVisible: boolean
    constructor(public Id: string, protected blotter: IAdaptableBlotter) {
        this.InitBaseState()
        blotter.AdaptableBlotterStore.TheStore.subscribe(() => this.InitBaseState())
    }

    private InitBaseState() {
        if (this.menuIsVisible != this.blotter.AdaptableBlotterStore.TheStore.getState().Menu.ContextMenu.IsVisible) {
            this.menuIsVisible = this.blotter.AdaptableBlotterStore.TheStore.getState().Menu.ContextMenu.IsVisible;
            if (this.menuIsVisible) {
                this.addColumnMenuItems(this.blotter.AdaptableBlotterStore.TheStore.getState().Menu.ContextMenu.ColumnId)
            }
        }
    }

    public menuItemConfig: IMenuItem;

    public getMenuItems(): IMenuItem[] {
        return [this.menuItemConfig];
    }

    protected addColumnMenuItems(columnId: string): void {
    }

    getStrategyEntitlement(): IEntitlement {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Entitlements.FunctionEntitlements.find(x => x.FunctionName == this.Id)
    }

    createMenuItemShowPopup(Label: string,
        ComponentName: string,
        MenuType: MenuType.ActionPopup | MenuType.ConfigurationPopup,
        GlyphIcon: string,
        PopupParams?:string): MenuItemShowPopup {
        return new MenuItemShowPopup(Label,
            this.Id,
            ComponentName,
            MenuType,
            GlyphIcon,
            this.getStrategyEntitlement(), 
            PopupParams);
    }

}
