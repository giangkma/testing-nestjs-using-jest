export interface I7DigitalSubcription {
    activatedAt: string;
    country: string;
    currency: string;
    currentPeriodStartDate: string;
    expiryDate: string;
    planCode: string;
    recurringFee: number;
    userId: string;
    status: string;
}

export interface IPayload7DigitalSubcription {
    country: string;
    activatedAt: string;
    currentPeriodStartDate: string;
    expiryDate: string;
    userId: string;
}
