import { Response } from 'express';
export interface TokenPayload {
    userId: string;
    role: string;
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload | null;
export declare const sendTokenResponse: (user: any, statusCode: number, res: Response) => void;
//# sourceMappingURL=jwt.d.ts.map