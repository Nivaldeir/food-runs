type IAuth = {
  email: string;
  password: string;
};

type IResponse = {
  error: boolean;
  message?: string;
  data: any;
};
