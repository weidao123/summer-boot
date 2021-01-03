/**
 * 获取当时间、日期
 */
export default class SummerDate {

    public static getDate(d?: number | string | Date) {
        const date = new Date(d || Date.now());
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return {
            year,
            month: month < 10 ? `0${month}` : month,
            day: day < 10 ? `0${day}` : day,
            hours: hours < 10 ? `0${hours}` : hours,
            minutes: minutes < 10 ? `0${minutes}` : minutes,
            seconds: seconds < 10 ? `0${seconds}` : seconds,
        }
    }

    public static currentDate(): string {
        const { year, month, day, hours, minutes, seconds } = this.getDate();
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public static form(d: number | string | Date) {
        const { year, month, day, hours, minutes, seconds } = this.getDate(d);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public static format(f: string, d?: number | string | Date) {
        const { year, month, day, hours, minutes, seconds } = this.getDate();
        const table = {
            "YYYY": year,
            "MM": month,
            "DD": day,
            "HH": hours,
            "mm": minutes,
            "ss": seconds,
        };
        Object.keys(table).forEach(k => f = f.replace(k, table[k]));
        return f;
    }
}
