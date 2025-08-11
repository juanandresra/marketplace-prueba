export interface CartProduct {
    id: string;
    slug: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    storeId?: string;
    storeName?: string;
}