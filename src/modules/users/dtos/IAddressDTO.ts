export default interface IAddressDTO {
  type: 'address' | 'billing_address' | 'shipping_address';
  street: string;
  number: number;
  district: string;
  complement?: string;
  city: string;
  uf: string;
  zipcode: number;
  lat?: number;
  lon?: number;
  user_id: string;
}
