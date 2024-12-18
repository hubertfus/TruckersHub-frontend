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
                Dimensions: {dimensions.length.toFixed(2)} x {dimensions.width.toFixed(2)} x {dimensions.height.toFixed(2)} cm
            </p>
            <p>Weight: {weight.toFixed(2)} kg</p>
        </div>
    );
}

export default LoadDetails