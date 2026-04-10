export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "card" | "cash" | "";
export type TBuyerError = Partial<Record<keyof IBuyer, string>>;

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiModel {
  getProductList(): Promise<IProductListApi>;
  orderProducts(data: IOrder, method?: ApiPostMethods): Promise<IOrderResult>;
}

export interface IProductItem {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export interface IBuyer {
  address: string;
  email: string;
  phone: string;
  payment: TPayment;
}

export interface IProductListApi {
  total: number;
  items: IProductItem[];
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type IActions = {
	onClick: () => void;
};