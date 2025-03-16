import cron, {
    type ScheduledTask,
    type ScheduleOptions as NodeCronScheduleOptions
} from 'node-cron'

export type ScheduleOptions = Omit<NodeCronScheduleOptions, (
    'name' |
    'timezone'
)>

export default abstract class Schedule {
    protected schedule!: ScheduledTask

    constructor(
        public cronExpression: string,
        public options: ScheduleOptions = {}
    ) {
        this.init()
    }

    // Instance Methods =======================================================
    public restart() {
        this.schedule.stop()
        this.schedule.start()
    }

    // ------------------------------------------------------------------------

    public setInterval(cronExpression: string) {
        this.schedule.stop()
        this.cronExpression = cronExpression
        this.init()
    }

    // Protecteds -------------------------------------------------------------
    protected abstract handle(now: Date | 'manual' | 'init'): (
        void | Promise<void>
    )

    // Privates ---------------------------------------------------------------
    private init() {
        this.schedule = cron.schedule(
            this.cronExpression,
            this.handle,
            {
                ...this.options,
                name: this.constructor.name,
                timezone: process.env.APP_TIMEZONE,
            }
        )
    }
}