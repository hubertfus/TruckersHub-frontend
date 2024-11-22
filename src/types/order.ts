export interface Dimensions {
    length: number;
    width: number;
    height: number;
}

export interface LoadDetails {
    _id: string;
    dimensions: Dimensions;
    type: string;
    weight: number;
}

export interface Address {
    _id: string;
    street: string;
    city: string;
    zip_code: string;
    country: string;
}

export interface Order {
    _id: string;
    order_number: string;
    load_details: LoadDetails;
    pickup_address: Address;
    delivery_address: Address;
    status: 'created' | 'in_progress' | 'completed' | 'cancelled';
    assigned_driver: string | null;
    vehicle_id: string | null;
    estimated_delivery_time: string | null;
    created_at: string;
    updated_at: string;
}