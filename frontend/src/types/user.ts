export interface User {
  name: string;
  email: string;
  access_token: string;
  school: {
    id: number;
    name: string;
    logo_url: string;
    main_color: string;
  };
}
