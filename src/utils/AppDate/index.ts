import {
    add,
    differenceInMilliseconds,
    differenceInSeconds,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    differenceInYears
} from "date-fns"

import type { Duration } from "date-fns"

import type { DiffType } from "./types"

class AppDate extends Date {
    constructor(date: string | number | Date | AppDate = new Date) {
        super(date)
    }

    public add(duration: Duration) {
        return add(this, duration)
    }

    public diff(type: DiffType, compare: Date) {
        switch (type) {
            case "ms": return differenceInMilliseconds(this, compare)
            case "s": return differenceInSeconds(this, compare)
            case "m": return differenceInMinutes(this, compare)
            case "h": return differenceInHours(this, compare)
            case "d": return differenceInDays(this, compare)
            case "w": return differenceInWeeks(this, compare)
            case "M": return differenceInMonths(this, compare)
            case "y": return differenceInYears(this, compare)
        }
    }
}

export default AppDate
export type {
    Duration
}