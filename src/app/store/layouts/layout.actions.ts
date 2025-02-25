import { createAction, props } from '@ngrx/store';

export const changeMode = createAction('[Layout] set mode', props<{ mode: string }>())
export const changesLayout = createAction('[Layout] Set Horizontal layout', props<{ layoutMode: string }>());
export const changeLayoutWidth = createAction('[Layout] Set LayoutWidth', props<{ layoutWidth: string }>());
export const changeSidebarMode = createAction('[Layout] Set SidebarMode', props<{ sidebarMode: string }>());
export const changeTopbarMode = createAction('[Layout] Set TopbarMode', props<{ topbarmode: string }>());
