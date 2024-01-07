type Image = {
  url: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: Image;
};
