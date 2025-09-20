export type ShopStatus='active'|'inactive';
export type Province='AB'|'BC'|'MB'|'NB'|'NL'|'NS'|'ON'|'PE'|'QC'|'SK'|'NT'|'NU'|'YT';

export interface Shop
{
    id:number;
    code:string;
    shopName:string;
    status: ShopStatus;
    address:string;
    city:string;
    province:Province;
    postalCode:string;
    contactName:string;
    phone:string;
    email:string;
    createdAt:string;
    updatedAt:string;
}

export type ShopCreate = Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>;
export type ShopUpdate = Partial<ShopCreate>;