import { Action, createReducer, on } from '@ngrx/store';
import { changesLayout, changeMode, changeLayoutWidth, changeSidebarMode, changeTopbarMode } from './layout.actions';
import { DATA_LAYOUT_MODE, LAYOUT_MODE_TYPES, LAYOUT_WIDTH_TYPES, SIDEBAR_TYPE, TOPBAR_MODE_TYPES } from './layout';

export interface LayoutState {
    LAYOUT_MODE: string;
    DATA_LAYOUT: string;
    LAYOUT_WIDTH: string;
    SIDEBAR_MODE: string;
    TOPBAR_TYPE: string;
}

// INIT_STATE 
export const initialState: LayoutState = {
    LAYOUT_MODE: LAYOUT_MODE_TYPES.LIGHTMODE,
    DATA_LAYOUT: DATA_LAYOUT_MODE.VERTICAL,
    LAYOUT_WIDTH: LAYOUT_WIDTH_TYPES.FLUID,
    SIDEBAR_MODE: SIDEBAR_TYPE.DARK,
    TOPBAR_TYPE: TOPBAR_MODE_TYPES.DARK,
}

// Reducer
export const layoutReducer = createReducer(
    initialState,
    on(changeMode, (state, action) => ({ ...state, LAYOUT_MODE: action.mode })),
    on(changesLayout, (state, action) => ({ ...state, DATA_LAYOUT: action.layoutMode })),
    on(changeLayoutWidth, (state, action) => ({ ...state, LAYOUT_WIDTH: action.layoutWidth })),
    on(changeSidebarMode, (state, action) => ({ ...state, SIDEBAR_MODE: action.sidebarMode })),
    on(changeTopbarMode, (state, action) => ({ ...state, TOPBAR_TYPE: action.topbarmode })),
);

// Selector
export function reducer(state: LayoutState | undefined, action: Action) {
    return layoutReducer(state, action);
}