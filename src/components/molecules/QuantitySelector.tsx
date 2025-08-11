// Molecule: Selector de cantidad
// Permite aumentar o disminuir la cantidad de un producto
'use client';

interface Props {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChange }: Props) => {
    // Handler para cambio de cantidad

    const onValueChange = (value: number) => {
        if (quantity + value < 1) return;
        onQuantityChange(quantity + value);
    };

    return (
        <div className="flex items-center gap-2">
            <button 
                className="btn btn-outline btn-error btn-sm" 
                onClick={() => onValueChange(-1)}
            >
                -
            </button>

            <span className="px-4 py-1 border border-base-300 rounded-lg bg-base-200 text-base-content">
                {quantity}
            </span>

            <button 
                className="btn btn-outline btn-success btn-sm" 
                onClick={() => onValueChange(1)}
            >
                +
            </button>
        </div>
    );
};
