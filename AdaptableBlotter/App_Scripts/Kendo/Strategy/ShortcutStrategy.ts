import {IShortcut} from '../../Core/Interface/IShortcutStrategy';
import {MenuItemShowPopup} from '../../Core/MenuItem';
import {AdaptableStrategyBase} from '../../Core/AdaptableStrategyBase';
import * as StrategyIds from '../../Core/StrategyIds'
import {IMenuItem} from '../../Core/Interface/IStrategy';

import {IAdaptableBlotter} from '../../Core/Interface/IAdaptableBlotter';

export class ShortcutStrategy extends AdaptableStrategyBase {
    private Shortcuts: IShortcut[]
    private menuItemConfig: IMenuItem;
    constructor(blotter: IAdaptableBlotter) {
        super(StrategyIds.ShortcutId, blotter)
        this.menuItemConfig = new MenuItemShowPopup("Configure Shortcut", this.Id, 'ShortcutConfig');
        this.InitShortcut();
        blotter.AdaptableBlotterStore.TheStore.subscribe(() => this.InitShortcut())
    }

    InitShortcut() {
        if (this.Shortcuts != this.blotter.AdaptableBlotterStore.TheStore.getState().Shortcut.Shortcuts) {
          //  this.removeCustomSorts();
            this.Shortcuts = this.blotter.AdaptableBlotterStore.TheStore.getState().Shortcut.Shortcuts;
          //  this.applyCustomSorts();
        }
    }
/*
    removeCustomSorts() {
        if (this.Shortcuts) {
            this.Shortcuts.forEach(shortcut => {
                this.blotter.removeCustomSort(customSort.ColumnId)
            });
        }
    }
*/
   
    getMenuItems(): IMenuItem[] {
        return [this.menuItemConfig];
    }
}

