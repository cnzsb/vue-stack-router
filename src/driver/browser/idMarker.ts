const STORAGE_ID_MARKER_KEY = 'VUE_STACK_ROUTER_ID';
let id: number = Number(sessionStorage.getItem('VUE_STACK_ROUTER_ID')) || 0;
export default function idMarker(): number {
  const newId = ++id;
  sessionStorage.setItem(STORAGE_ID_MARKER_KEY, String(newId));
  return newId;
}
