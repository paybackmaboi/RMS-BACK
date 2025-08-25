declare namespace Express {
    interface Request {
        user?: {
            id: number;
            role: 'student' | 'admin' | 'accounting';
            idNumber?: string;
            firstName?: string;
            lastName?: string;
        };
    }
}
