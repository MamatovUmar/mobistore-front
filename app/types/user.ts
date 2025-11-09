export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  language_code: string | null;
  image_url: string | null;
  role: string;
  phone_number: string | null;
  telegram: string | null;
  last_entered_at: string;
  created_at: string;
  show_contacts: boolean;
}
