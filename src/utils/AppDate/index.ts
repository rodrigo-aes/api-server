import { add } from "date-fns"
import type { Duration } from "date-fns"

class AppDate extends Date {
    constructor(date: string | number | Date | AppDate = new Date) {
        super(date)
    }

    public add(duration: Duration) {
        return add(this, duration)
    }
}

export default AppDate