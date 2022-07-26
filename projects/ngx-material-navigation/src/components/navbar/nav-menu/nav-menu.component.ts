import { AfterContentChecked, Component, EnvironmentInjector, HostListener, Input, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenu } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavMenu, NavMenuElement } from '../../../models/nav-menu.model';
import { NavUtilities } from '../../../utilities/nav.utilities';
import { PurifyUtilities } from '../../../utilities/purify.utilities';

/**
 * Displays a menu based on the provided NavMenu data.
 */
@Component({
    selector: 'ngx-mat-navigation-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements AfterContentChecked {

    @ViewChild('menu', { static: true })
    menu!: MatMenu;

    /**
     * The data that is used to generate the menu.
     */
    @Input()
    navMenu!: NavMenu;

    /**
     * The sidenav element. Is needed so that it can be closed from within a menu.
     */
    @Input()
    sidenav?: MatSidenav;

    /**
     * The width of the menu. Is set to the value of the button opening it.
     */
    @Input()
    menuWidth!: number;

    NavUtilities = NavUtilities;

    @ViewChild('nestedMenuButton')
    nestedMenuButton?: MatButton;

    nestedMenuWidth!: number;

    constructor(private readonly sanitizer: DomSanitizer, private readonly injector: EnvironmentInjector) {}

    ngAfterContentChecked(): void {
        if (this.nestedMenuButton) {
            this.nestedMenuWidth = this.getMenuWidth();
        }
    }

    /**
     * Runs the action of the element.
     * This wrapper is needed to enable the user to use injections in his action functions.
     *
     * @param element - The element which action should be invoked.
     */
    runAction(element: NavMenuElement): void {
        this.injector.runInContext(() => this.NavUtilities.asButton(element).action());
    }

    /**
     * Updates the width of the nestedMenu.
     */
    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (this.nestedMenuButton) {
            this.nestedMenuWidth = this.getMenuWidth();
        }
    }

    private getMenuWidth(): number {
        return (this.nestedMenuButton?._elementRef.nativeElement as HTMLElement).offsetWidth;
    }

    /**
     * Gets the sanitized HTML for the given element.
     *
     * @param element - The NavHtml element.
     * @returns The safe html.
     * @throws When the given element is not html.
     */
    getSanitizedHtmlFor(element: NavMenuElement): SafeHtml {
        if (NavUtilities.isNavHtml(element)) {
            return this.sanitizer.bypassSecurityTrustHtml(PurifyUtilities.sanitize(element.html));
        }
        else {
            throw new Error('The passed HTML is not valid.');
        }
    }

    /**
     * Defines if the sidenav should be closed when the given element is clicked.
     *
     * @param element - The element that has been clicked.
     */
    clickSidenavElement(element: NavMenuElement): void {
        if (this.sidenav) {
            switch (element.type) {
                case 'image':
                case 'title':
                case 'menu':
                case 'html':
                    return;
                default:
                    void this.sidenav.close();
                    return;
            }
        }
    }
}