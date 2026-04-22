import { cookies } from 'next/headers';
import { AdminLogin } from './AdminLogin';
import { AdminPanel } from './AdminPanel';

export default function AdminPage() {
  const secret = process.env.ADMIN_SECRET;
  const token = cookies().get('admin_token')?.value;
  const authed = !!secret && token === secret;

  if (!authed) return <AdminLogin/>;
  return <AdminPanel secret={secret}/>;
}
