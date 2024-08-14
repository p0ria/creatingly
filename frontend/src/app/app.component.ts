import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { ElementsCatalog } from './components/elements-catalog/elements-catalog.component';
import { DraggableDirective } from './directives/draggable.directive';
import { ResizableDirective } from './directives/resizable.directive';
import { DesignerService } from './services/designer.service';
import { ArrowSvgComponent } from './components/arrow-svg/arrow-svg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ResizableDirective,
    DraggableDirective,
    ElementsCatalog,
    ArrowSvgComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  designer = inject(DesignerService);
  uiElements$ = this.designer.state$.pipe(map((state) => Object.values(state)));
}
