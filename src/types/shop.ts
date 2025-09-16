export enum ShopStatus 
{
    Active="Active",
    Inactive="Inactive",
}

export interface Shop
{
    ShopId: string;
    Name:string;
    Status: ShopStatus;
    Address:string;
    PostalCode:string;
    ContactPerson:string;
    ContactEmail:string;
}