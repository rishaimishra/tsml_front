export interface verifyOptRequest { 
    mobile_no: number;
    otp: number;
}

export interface verifyOtpResponse {
    status: number,
    message?: string,
}
