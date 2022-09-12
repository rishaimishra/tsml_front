export interface getOptRequest { 
    mobile_no: number;

}

export interface getOtpResponse {
    status: number,
    message?: string,
    result : {
        id: string,
        mob_number: number,
        otp: number,
        updated_at: string,
        created_at: string,
    }
}
