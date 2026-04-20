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