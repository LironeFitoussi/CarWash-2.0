declare namespace Express {
  interface Request {
    auth?: {
      sub: string;
      scope?: string;
      [key: string]: any;
    };
    user?: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      picture?: string;
      sub: string;
      [key: string]: any;
    };
  }
} 