import { Slot } from 'expo-router';
import { AuthProvider } from './components/authProvider/authProvider';

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
