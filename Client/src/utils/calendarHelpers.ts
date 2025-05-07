export const formatDateForInput = (date: string) => {
    const israelDate = new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
    return new Date(israelDate).toISOString().slice(0, 16);
};

export const toIsraelTime = (date: Date): Date => {
    const israelDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    return israelDate;
};

// Only used when sending to the API
export const toUTCForAPI = (localDateTime: string): string => {
    const date = new Date(localDateTime);
    const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
    ));
    return utcDate.toISOString();
};

// Keep the original selected time as is for the form
export const fromUTCToLocal = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
};
