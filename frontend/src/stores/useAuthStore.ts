import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface UserInfo {
  name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {} as UserInfo | null,
    loading: false,
    errorMessage: '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.userInfo,
  },
  actions: {
    async logIn(email: string, password: string, router: any) {
      this.loading = true;
      this.errorMessage = '';

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/usuarios/login`,
          { email, password },
          { headers: { 'Content-Type': 'application/json' } }
        );


        if (response.status !== 200) {
          this.errorMessage = 'Invalid credentials.';
          return;
        }

        const { token: authToken } = response.data;


        this.token = authToken;
        localStorage.setItem('token', authToken);

        try {
          this.userInfo = jwtDecode<UserInfo>(authToken);
          console.log(this.userInfo);
        } catch (decodeError) {
          console.error('Token decoding error:', decodeError);
          this.errorMessage = 'Token decoding failed.';
          return;
        }

        console.log('Login successful:', response.data);
        try {
          console.log('Redirecting to store...');
          router.push('/store');
          console.log('Redirected!');

        } catch (error) {
          console.error('Navigation error:', error);
        }
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = 'Error during login. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    logOut(router: any) {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem('token');
      router.push('/login');
    },
  },
});