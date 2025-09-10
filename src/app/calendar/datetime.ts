export function formatEventDateTime(iso: string) {
    const d = new Date(iso);
    const date = new Intl.DateTimeFormat(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(d);
    const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d);
    return { date, time };
}
