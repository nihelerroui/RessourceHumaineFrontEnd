import { Component, OnInit } from '@angular/core';
import { EventService } from '../../core/services/event.service';

import { LayoutState, initialState } from 'src/app/store/layouts/layouts.reducer';
import { Store } from '@ngrx/store';
import { changeLayoutWidth, changeMode, changeSidebarMode } from 'src/app/store/layouts/layout.actions';
import { getLayoutMode, getLayoutWidth, getsidebar } from 'src/app/store/layouts/layout.selector';
import { RootReducerState } from 'src/app/store';
import { changesLayout } from 'src/app/store/layouts/layout.actions';
// import { RootReducerState } from 'src/app/store';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss']
})

/**
 * Rightsidebar component
 */
export class RightsidebarComponent implements OnInit {

  isVisible: string;
  attribute: string;
  width: string;
  mode: string;
  topbar: string;
  theme: string;
  layoutSize: string;
  sidebar: string;
  initialAppState!: LayoutState;
  constructor(private eventService: EventService, public store: Store<RootReducerState>) { }

  ngOnInit() {
    this.initialAppState = initialState;
    this.store.select('layout').subscribe((data) => {
      this.mode = data.LAYOUT_MODE;
      this.theme = data.DATA_LAYOUT;
      this.topbar = data.TOPBAR_TYPE;
      this.sidebar = data.SIDEBAR_MODE;
      this.layoutSize = data.LAYOUT_WIDTH;
    })
    this.attribute = '';

    /**
     * horizontal-vertical layput set
     */
    this.attribute = document.body.getAttribute('data-layout');
    const vertical = document.getElementById('is-layout');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (this.attribute == 'horizontal') {
      vertical.removeAttribute('checked');
    }
  }

  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove('right-bar-enabled');
  }

  /**
   * Change Topbar
   */
  changeTopbar(topbar: string) {
    this.topbar = topbar;
    this.eventService.broadcast('changeTopbar', topbar);
  }

  // toggle button of layout mode
  toggleLayout() {
    this.theme = this.theme === 'vertical' ? 'horizontal' : 'vertical';
    this.changeLayout(this.theme);
  }

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layoutMode: string) {
    this.theme = layoutMode;
    this.store.dispatch(changesLayout({ layoutMode }));
    this.store.select(getLayoutMode).subscribe((layout) => {
      document.documentElement.setAttribute('data-layout', layout)
    })
  }

  changeWidth(layoutWidth: any) {
    this.store.dispatch(changeLayoutWidth({ layoutWidth }));
    this.store.select(getLayoutWidth).subscribe((layoutWidth) => {
      document.documentElement.setAttribute('data-layout-size', layoutWidth);
    })
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }
  // sidebar
  changeSidebartype(sidebarMode: any) {
    this.store.dispatch(changeSidebarMode({ sidebarMode }));
    this.store.select(getsidebar).subscribe((sidebarMode) => {
      document.documentElement.setAttribute('data-sidebar', sidebarMode)
    })
  }

  changeMode(mode: string) {
    this.store.dispatch(changeMode({ mode }));
    this.store.select(getLayoutMode).subscribe((mode) => {
      document.documentElement.setAttribute('data-bs-theme', mode)
    })
    if (mode == 'light') {
      document.documentElement.setAttribute('data-topbar', 'dark')
    } else {
      document.documentElement.setAttribute('data-topbar', mode)
    }
  }
}
