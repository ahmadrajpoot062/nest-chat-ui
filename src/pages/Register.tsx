import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Colors from '../theme/colors';

interface FormData {
  username: string;
  password: string;
  avatar?: FileList;
}

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().min(6).required(),
}).required();

export default function Register() {
  const nav = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  const avatarFile = watch('avatar')?.[0];
  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(avatarFile);
    } else setPreview(null);
  }, [avatarFile]);

  const onSubmit = async (data: FormData) => {
    try {
      const form = new FormData();
      form.append('username', data.username);
      form.append('password', data.password);
      if (data.avatar?.[0]) form.append('avatar', data.avatar[0]);
      await api.post('/auth/register', form, { headers: { 'Content-Type': 'multipart/form-data' }});
      toast.success('Registered!');
      nav('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: Colors.light.background }}>
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg" style={{ backgroundColor: Colors.light.card }}>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold" style={{ color: Colors.light.textDark }}>Create an account</h2>
          <p className="mt-2 text-sm" style={{ color: Colors.light.textLight }}>Join our community today</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {preview ? (
                <img 
                  src={preview} 
                  className="w-24 h-24 rounded-full object-cover border-4" 
                  style={{ borderColor: Colors.light.primaryLight }}
                  alt="avatar preview" 
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center border-4"
                  style={{ 
                    borderColor: Colors.light.primaryLight,
                    backgroundColor: Colors.light.input
                  }}
                >
                  <span style={{ color: Colors.light.textLight }}>Avatar</span>
                </div>
              )}
              <label 
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-opacity-90 transition-colors"
                style={{ 
                  backgroundColor: Colors.light.primary,
                  color: '#FFFFFF'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <input 
                  id="avatar-upload"
                  type="file" 
                  accept="image/*" 
                  {...register('avatar')} 
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                placeholder="Username"
                {...register('username')}
                className="appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:z-10"
                style={{
                  backgroundColor: Colors.light.background,
                  borderColor: errors.username ? Colors.light.error : Colors.light.input,
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
                placeholder="Password (min 6 characters)"
                {...register('password')}
                className="appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:z-10"
                style={{
                  backgroundColor: Colors.light.background,
                  borderColor: errors.password ? Colors.light.error : Colors.light.input,
                  color: Colors.light.textDark,
                }}
              />
              {errors.password && <p className="mt-1 text-sm" style={{ color: Colors.light.error }}>{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-opacity-90 transition-colors"
              style={{
                backgroundColor: Colors.light.primary,
                color: '#FFFFFF',
              }}
            >
              Register
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm" style={{ color: Colors.light.textLight }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium hover:underline transition-colors"
              style={{ 
                color: Colors.light.primary,
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}