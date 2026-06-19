import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  template: `
    <div class="kpi-card">
      <div class="kpi-icon" [class]="iconClass()"><i [class]="icon()"></i></div>
      <div>
        <div class="kpi-label">{{ label() }}</div>
        <div class="kpi-value">{{ value() }}</div>
      </div>
    </div>
  `,
})
export class KpiCardComponent {
  label = input.required<string>();
  value = input.required<number | string>();
  icon  = input.required<string>();       // e.g. "fa-solid fa-clipboard-list"
  color = input<'blue' | 'amber' | 'green' | 'rose' | 'violet'>('blue');

  iconClass() { return `kpi-icon bg-${this.color()}`; }
}
