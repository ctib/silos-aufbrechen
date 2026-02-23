// Forschungscall-Typen – zentral definiert, wird in AdminPanel, InternalArea, TableView verwendet

export const CALL_TYPES = [
  { value: 'call_for_papers', label: 'Call for Papers' },
  { value: 'funding', label: 'Förderung' },
  { value: 'conference', label: 'Konferenz' },
  { value: 'journal', label: 'Journal' },
  { value: 'other', label: 'Sonstiges' },
] as const;

export function callTypeLabel(type: string): string {
  return CALL_TYPES.find(t => t.value === type)?.label ?? type;
}
