import { Component } from '@angular/core';
import { DocsListComponent } from './components/docs-list/docs-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DocsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
