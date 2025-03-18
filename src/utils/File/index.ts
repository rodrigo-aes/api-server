import { fileTypeFromBuffer } from "file-type"

class File {
    public static bufferType(buffer: Buffer) {
        return fileTypeFromBuffer(buffer)
    }

}

export default File