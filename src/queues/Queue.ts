import { Queue as BullMQQueue, Worker, Job } from "bullmq"
import type Redis from "@/database/Redis/Redis"

export default abstract class Queue extends BullMQQueue {
    protected worker!: Worker

    constructor(name: string, connection: Redis, concurrency: number = 1) {
        super(name, {
            connection,
            defaultJobOptions: {
                attempts: 1,
                removeOnComplete: true,
                removeOnFail: true,
            }
        })

        this.worker = new Worker(this.name, this.processor, {
            connection,
            concurrency
        })
    }

    public abstract processor(job: Job, token?: string): any | Promise<any>
}
