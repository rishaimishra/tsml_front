export interface RegistrationRequest { 
    name: string;
    email: string;
    phone: number;
    password: number;
    gstin: string;
    org_pan: string;
    org_name: string;
    org_address: string;
    pref_product: string;
    pref_product_size: string;
    user_type: string;
    company_gst: string;
    company_linked_address: string;
    company_pan: string;
    company_name: string;
    business_nature: string;
    first_name: string;
    last_name: string;
    addressone: string;
    address_proof_file: string;
    cancel_cheque_file: string
}

export interface RegistrationResponse {
    success: boolean,
    message?: string
}