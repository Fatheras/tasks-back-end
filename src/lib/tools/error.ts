export default class CustomError extends Error {
    private code: number;

    public get Code(): number {
        return this.code;
    }

    constructor(code: number) {
        super();
        this.code = code;
    }
}
