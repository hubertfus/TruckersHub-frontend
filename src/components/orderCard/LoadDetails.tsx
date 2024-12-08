interface LoadDetailsProps {
    type: string;
    weight: number;
    dimensions: { length: number; width: number; height: number };
}

function LoadDetails({ type, weight, dimensions }: LoadDetailsProps) {
    return (
        <div className="text-sm">
            <p className="font-semibold">Load Details:</p>
            <p>Type: {type}</p>
            <p>
                Dimensions: {dimensions.length} x {dimensions.width} x {dimensions.height} cm
            </p>
            <p>Weight: {weight} kg</p>
        </div>
    );
}

export default LoadDetails