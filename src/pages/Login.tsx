import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import Colors from '../theme/colors';

interface FormData { username: string; password: string; }

const schema = yup.object({ username: yup.string().required(), password: yup.string().required()}).required();

export default function Login() {
  const nav = useNavigate();
  const { setUser } = useUser();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      const { access_token, user } = res.data;
      localStorage.setItem('token', access_token);
      const avatarURL = user.avatar ? `http://localhost:3000/uploads/avatars/${user.avatar}` : undefined;
      setUser(user.username, avatarURL);
      toast.success('Login successful!');
      nav('/select-room');
    } catch {
      toast.error('Login failed!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: Colors.light.background }}>
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg" style={{ backgroundColor: Colors.light.card }}>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold" style={{ color: Colors.light.textDark }}>Welcome back</h2>
          <p className="mt-2 text-sm" style={{ color: Colors.light.textLight }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                placeholder="Username"
                {...register('username')}
                className={`appearance-none relative block w-full px-3 py-3 rounded-md focus:outline-none focus:ring-2 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: Colors.light.background,
                  color: Colors.light.textDark,
                }}
              />
              {errors.username && <p className="mt-1 text-sm" style={{ color: Colors.light.error }}>{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                {...register('password')}
                className={`appearance-none relative block w-full px-3 py-3 rounded-md focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: Colors.light.background,
                  color: Colors.light.textDark,
                }}
              />
              {errors.password && <p className="mt-1 text-sm" style={{ color: Colors.light.error }}>{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-opacity-90 transition-colors"
              style={{
                backgroundColor: Colors.light.primary,
                color: '#FFFFFF',
              }}
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm" style={{ color: Colors.light.textLight }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium hover:underline transition-colors"
              style={{ 
                color: Colors.light.primary,
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}