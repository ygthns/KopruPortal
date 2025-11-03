import { demoData } from '@/mocks/fixtures/demo-data';
import { useDemoStore } from '@/store/use-demo-store';

export function resetDemoState() {
  useDemoStore.getState().reset(demoData);
}
