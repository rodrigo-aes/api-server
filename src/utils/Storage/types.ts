import type { FileTypeResult } from "file-type"

export type DestTypeInfo = (
    { type: 'dir' } |
    { type: 'file' } & FileTypeResult
)

export type StorageResponseType = 'inline' | 'download'

export type CachePolicyControl = (
    'public' |
    'private' |
    'no-store' |
    'no-cache'
)

export type MakeResponseOptions = {
    filename?: string
    cache?: {
        policy?: CachePolicyControl,
        maxAge?: number | Date
    }
}