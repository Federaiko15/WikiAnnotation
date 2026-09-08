export interface User {
  username: string;
  email: string;
  password: string;
}

export interface AuthFormState {
  success: boolean;
  message: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
}

