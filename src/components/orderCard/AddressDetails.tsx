interface AddressDetailsProps {
    title: string;
    address: {
        street: string;
        city: string;
        zip_code: string;
        country: string;
    };
}

function AddressDetails({ title, address }: AddressDetailsProps) {
    return (
        <div className="text-sm">
            <p className="font-semibold">{title}:</p>
            <p>{address.street}, {address.city}</p>
            <p>{address.zip_code}, {address.country}</p>
        </div>
    );
}

export default AddressDetails