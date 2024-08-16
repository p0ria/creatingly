import { Component, inject } from '@angular/core';
import { DesignerService } from '../../services/designer.service';
import { Shape } from '../../types';

@Component({
  selector: 'app-elements-catalog',
  standalone: true,
  imports: [],
  templateUrl: './elements-catalog.component.html',
  styleUrl: './elements-catalog.component.scss',
})
export class ElementsCatalog {
  SHAPES: { type: Shape; class: string }[] = [
    {
      type: Shape.Square,
      class:
        'w-10 h-10 bg-slate-300 border shadow-inner cursor-pointer hover:scale-110',
    },
    {
      type: Shape.Rect,
      class:
        'w-10 h-16 bg-slate-300 border shadow-inner cursor-pointer hover:scale-110',
    },
    {
      type: Shape.Circle,
      class:
        '-mt-1 w-10 h-10 rounded-full bg-slate-300 border shadow-inner cursor-pointer hover:scale-110',
    },
  ];
  designer = inject(DesignerService);

  add(shape: Shape) {
    this.designer.addEl(shape);
  }
}
