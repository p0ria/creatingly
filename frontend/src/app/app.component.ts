import { Component, inject } from '@angular/core';
import { ResizableDirective } from './directives/resizable.directive';
import { DesignerService } from './services/designer.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ResizableDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  designerService = inject(DesignerService);
  uiElements$ = this.designerService.state$.pipe(
    map((state) => Object.values(state))
  );
}
