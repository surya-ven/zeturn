/**
 * @class Zeturn helper class
 * @constructor if custom options provided, use class instance
 * @param {object} opt custom options
 */
export class Zeturn {
    private static NOT_FOUND_CODE: string = "zeturn_unknown";
    private static NOT_FOUND_MSG: string = "zeturn: unknown";
    private notFoundCode: string;
    private notFoundMsg: string;

    /**
     * Creates an instance of Zeturn if custom options are required.
     */
    constructor(opt: { notFoundCode?: string; notFoundMsg?: string }) {
        this.notFoundCode = opt.notFoundCode || Zeturn.NOT_FOUND_CODE;
        this.notFoundMsg = opt.notFoundMsg || Zeturn.NOT_FOUND_MSG;
    }

    /** Code helpers */

    /**
     * Extracts code from error object. Returns default error code if
     * no code attribute is found.
     * @param error error object (usually from the try catch block)
     * @returns error code string
     */
    public static codeFromError = (error: unknown): string => {
        const errCode = (error as any)?.code;
        if (!errCode) return this.NOT_FOUND_CODE;
        return errCode;
    };

    /**
     * Extracts code from error object. Returns default error code if
     * no code attribute is found.
     * @param error error object (usually from the try catch block)
     * @returns error code string
     */
    public codeFromError = (error: unknown): string => {
        const errCode = (error as any)?.code;
        if (!errCode) return this.notFoundCode;
        return errCode;
    };

    /** Message helpers */

    /**
     * Extracts message from error object. Returns default error message if
     * no message attribute is found.
     * @param error error object (usually from the try catch block)
     * @returns error message string
     */
    public static msgFromError = (error: unknown): string => {
        const errMsg = (error as any)?.message;
        if (!errMsg) return this.NOT_FOUND_MSG;
        return errMsg;
    };

    /**
     * Extracts message from error object. Returns default error message if
     * no message attribute is found.
     * @param error error object (usually from the try catch block)
     * @returns error message string
     */
    public msgFromError = (error: unknown): string => {
        const errMsg = (error as any)?.message;
        if (!errMsg) return this.notFoundMsg;
        return errMsg;
    };
}
