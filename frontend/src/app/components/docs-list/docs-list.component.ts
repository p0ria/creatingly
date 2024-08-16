import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DesignerService } from '../../services/designer.service';
import { DocComponent } from '../doc/doc.component';
import { WsService } from '../../services/ws.service';
import { ArrowSvgComponent } from '../arrow-svg/arrow-svg.component';

@Component({
  selector: 'app-docs-list',
  standalone: true,
  imports: [CommonModule, DocComponent, ArrowSvgComponent],
  templateUrl: './docs-list.component.html',
  styleUrl: './docs-list.component.scss',
})
export class DocsListComponent {
  designer = inject(DesignerService);
  docsList$ = this.designer.docsList$;
  currentDoc$ = this.designer.currentDoc$;
  ws = inject(WsService);

  addNew() {
    let name = prompt('Document Name');
    if (name) {
      this.designer.addDoc(name);
    }
  }

  onDocChange(e) {
    const doc = e.target.value;
    this.designer.switchDoc(doc);
  }
}
