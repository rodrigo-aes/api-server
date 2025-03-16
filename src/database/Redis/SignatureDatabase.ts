import Redis from "./Redis";

class SignatureDatabase extends Redis { }

export default new SignatureDatabase(1)