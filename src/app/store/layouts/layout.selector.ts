import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState } from './layouts.reducer';

export const getLayoutState = createFeatureSelector<LayoutState>('layout');

export const getLayoutMode = createSelector(
    getLayoutState,
    (state: LayoutState) => state.LAYOUT_MODE
);

export const getDataLayout = createSelector(
    getLayoutState,
    (state: LayoutState) => state.DATA_LAYOUT
);

export const getLayoutWidth = createSelector(
    getLayoutState,
    (state: LayoutState) => state.LAYOUT_WIDTH
);
export const getsidebar = createSelector(
    getLayoutState,
    (state: LayoutState) => state.SIDEBAR_MODE

);

export const getTopbarLayout = createSelector(
    getLayoutState,
    (state: LayoutState) => state.TOPBAR_TYPE
);
