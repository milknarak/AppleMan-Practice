import { Component, computed, input } from '@angular/core';

import {
  AppointmentStatus, InspectionResult, InspectionStatus, MeetingStatus,
} from '../ci/ci.model';

type Kind = 'appointment' | 'meeting' | 'inspection' | 'result';

const MAP: Record<Kind, Record<string, { label: string; cls: string }>> = {
  appointment: {
    [AppointmentStatus.Pending]: { label: 'รอนัดหมาย',  cls: 'pending' },
    [AppointmentStatus.Booked]:  { label: 'นัดแล้ว',     cls: 'booked'  },
    [AppointmentStatus.Cancel]:  { label: 'ยกเลิก',      cls: 'cancel'  },
  },
  meeting: {
    [MeetingStatus.NotMet]: { label: 'ยังไม่ได้พบ', cls: 'pending' },
    [MeetingStatus.Met]:    { label: 'พบแล้ว',      cls: 'booked'  },
  },
  inspection: {
    [InspectionStatus.Wait]:       { label: 'รอตรวจ',     cls: 'pending' },
    [InspectionStatus.InProgress]: { label: 'กำลังตรวจ',  cls: 'inprog'  },
    [InspectionStatus.Done]:       { label: 'ตรวจเสร็จ',  cls: 'done'    },
  },
  result: {
    [InspectionResult.Pending]: { label: 'รอสรุปผล', cls: 'neutral' },
    [InspectionResult.Passed]:  { label: 'ผ่าน',     cls: 'passed'  },
    [InspectionResult.Failed]:  { label: 'ไม่ผ่าน',  cls: 'failed'  },
  },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge-status {{ info().cls }}">{{ info().label }}</span>`,
})
export class StatusBadgeComponent {
  kind = input.required<Kind>();
  value = input.required<string>();

  info = computed(() => MAP[this.kind()][this.value()] ?? { label: this.value(), cls: 'neutral' });
}
