import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DraggableDirective } from '../../directives/draggable.directive';
import { ResizableDirective } from '../../directives/resizable.directive';
import { ArrowSvgComponent } from '../arrow-svg/arrow-svg.component';
import { ElementsCatalog } from '../elements-catalog/elements-catalog.component';
import { map, tap } from 'rxjs';
import { DesignerService } from '../../services/designer.service';

@Component({
  selector: 'app-doc',
  standalone: true,
  imports: [
    CommonModule,
    ResizableDirective,
    DraggableDirective,
    ElementsCatalog,
    ArrowSvgComponent,
  ],
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.scss',
})
export class DocComponent {
  designer = inject(DesignerService);
  uiElements$ = this.designer.state$.pipe(map((state) => Object.values(state)));
}
