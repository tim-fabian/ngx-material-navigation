import { AfterContentChecked, Component, EnvironmentInjector, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NavUtilities } from '../../../utilities/nav.utilities';
import { MatButton } from '@angular/material/button';
import { NavFooterElement } from '../../../models/footer.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PurifyUtilities } from '../../../utilities/purify.utilities';

/**
 * Displays a single Navigation Element.
 */
@Component({
    selector: 'ngx-mat-navigation-footer-element',
    templateUrl: './footer-element.component.html',
    styleUrls: ['./footer-element.component.scss']
})
export class FooterElementComponent implements AfterContentChecked, OnInit {

    NavUtilities = NavUtilities;

    /**
     * The element to display.
     */
    @Input()
    element!: NavFooterElement;

    sanitizedHtml?: SafeHtml;

    @ViewChild('menuButton')
    menuButton?: MatButton;

    menuWidth!: number;

    constructor(private readonly sanitizer: DomSanitizer, private readonly injector: EnvironmentInjector) {}

    ngOnInit(): void {
        if (NavUtilities.isNavHtml(this.element)) {
            this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(PurifyUtilities.sanitize(this.element.html));
        }
    }

    ngAfterContentChecked(): void {
        if (this.menuButton) {
            this.menuWidth = this.getMenuWidth();
        }
    }

    /**
     * Runs the action of the element.
     * This wrapper is needed to enable the user to use injections in his action functions.
     */
    runAction(): void {
        this.injector.runInContext(() => this.NavUtilities.asButton(this.element).action());
    }

    /**
     * Updates the width of the menu to the value of its button.
     */
    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (this.menuButton) {
            this.menuWidth = this.getMenuWidth();
        }
    }

    private getMenuWidth(): number {
        return (this.menuButton?._elementRef.nativeElement as HTMLElement).offsetWidth;
    }
}