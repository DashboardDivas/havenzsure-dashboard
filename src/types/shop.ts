export type ShopStatus='active'|'inactive';
export type Province='AB'|'BC'|'MB'|'NB'|'NL'|'NS'|'ON'|'PE'|'QC'|'SK'|'NT'|'NU'|'YT';

export interface Shop
{
    id:number;
    code:string;
    shop_name:string;
    status: ShopStatus;
    address:string;
    city:string;
    province:Province;
    postal_code:string;
    contact_name:string;
    phone:string;
    email:string;

    created_at:string;
    updated_at:string;
}

export type ShopCreate = Omit<Shop, 'id' | 'created_at' | 'updated_at'>;
export type ShopUpdate = Partial<ShopCreate>;