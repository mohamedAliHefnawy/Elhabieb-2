export interface SessionData {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  secondName: string;
  image: string;
  validity: string;
  company: {
    name: string;
    image: string;
    phone: string;
    color: string;
  };
  phoneCompany: string;
  colorCompany: string;
  city: string;
  store: string;
}
