export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  fullname: string;
  email: string;
  password: string;
  verify_password: string;
  role: "CLIENT" | "SELLER";
  telephone: string;
}

export interface OtpCode{
    // email: string
    code_otp: number
}

export interface User{
  id: number;
  avatar: string | null;
  token: string | null
  fullname: string,
  email: string,
  role: 'CLIENT' | 'SELLER',
  telephone: string
}

/** Données acceptées par PUT /updateProfil */
export interface EditProfile {
  email: string;
  fullname: string;
}