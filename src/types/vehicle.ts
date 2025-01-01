export interface Vehicle {
    _id: string;
    license_plate: string;
    model: string;
    brand: string;
    year: string;
    isInUse:boolean;
    capacity: {
        weight: string;
        volume: {
            length: string;
            width: string;
            height: string;
        };
    };
    current_location: {
        latitude: string;
        longitude: string;
    };
    maintenance_schedule: Array<{
        service_type: string;
        date: string;
        description?: string;
    }>;
    updated_at:string;
    created_at:string;
}
