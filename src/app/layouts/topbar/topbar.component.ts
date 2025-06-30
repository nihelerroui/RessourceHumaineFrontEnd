import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { AuthenticationService } from "../../core/services/auth.service";
import { CookieService } from "ngx-cookie-service";
import { LanguageService } from "../../core/services/language.service";
import { TranslateService } from "@ngx-translate/core";
import { Store } from "@ngrx/store";
import { Observable, map } from "rxjs";
import { changesLayout } from "src/app/store/layouts/layout.actions";
import { getLayoutMode } from "src/app/store/layouts/layout.selector";
import { RootReducerState } from "src/app/store";
import { environment } from "src/environments/environment";
import { loadUserImage } from "src/app/store/Authentication/authentication.actions";
import { selectUserImage } from "src/app/store/Authentication/authentication-selector";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {
  userImage: string = "assets/images/users/avatar-1.jpg";
  mode: any;
  element: any;
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  theme: any;
  layout: string;
  dataLayout$: Observable<string>;
  // Define layoutMode as a property
  //routes client
  routesToHideBars: string[] = [
    "/import-contrat",
    "/contrats-client",
    "/facture/client/view",
  ];
  showBars: boolean = true;

  userName: string = "";
  userInitial: string = "";

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService,
    public store: Store<RootReducerState>
  ) {}

  listLang: any = [
    { text: "English", flag: "assets/images/flags/us.jpg", lang: "en" },
    { text: "Spanish", flag: "assets/images/flags/spain.jpg", lang: "es" },
    { text: "German", flag: "assets/images/flags/germany.jpg", lang: "de" },
    { text: "Italian", flag: "assets/images/flags/italy.jpg", lang: "it" },
    { text: "Russian", flag: "assets/images/flags/russia.jpg", lang: "ru" },
  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.loadUserData();
    this.store.dispatch(loadUserImage());

    this.store.select(selectUserImage).subscribe((img) => {
      if (img) this.userImage = img;
    });

    //détection de currentPath et le comparer
    this.router.events.subscribe(() => {
      const urlSegments = this.router.parseUrl(this.router.url).root.children[
        "primary"
      ]?.segments;
      const currentPath = "/" + urlSegments?.map((s) => s.path).join("/") || "";

      this.showBars = !this.routesToHideBars.some((route) =>
        currentPath.startsWith(route)
      );
    });

    // this.initialAppState = initialState;
    this.store.select("layout").subscribe((data) => {
      this.theme = data.DATA_LAYOUT;
    });
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get("lang");
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = "assets/images/flags/us.jpg";
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  loadUserData() {
    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}"
    );
    if (currentUser && currentUser.fullName) {
      this.userName = currentUser.fullName;
      this.userInitial = currentUser.fullName.charAt(0).toUpperCase();
    }
  }

  navigateToProfile() {
    this.router.navigate(["/profile"]);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService?.logout();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle("fullscreen-enable");
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  changeLayout(layoutMode: string) {
    this.theme = layoutMode;
    this.store.dispatch(changesLayout({ layoutMode }));
    this.store.select(getLayoutMode).subscribe((layout) => {
      document.documentElement.setAttribute("data-layout", layout);
    });
  }
}
