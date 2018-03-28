export class MerchantInfo {
    merchantId: string;
    merchantName: string;
    currency: string;
}

export class MerchantHierarchy extends MerchantInfo {
    children: MerchantHierarchy[];
}