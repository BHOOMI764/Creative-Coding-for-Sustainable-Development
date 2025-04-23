import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const RegisterPage: React.FC = () => {
  const { register, error } = useAuth();
  const { register: registerForm, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.username, data.email, data.password, data.role);
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
        <p className="text-gray-600 mt-1">Join the Creative Coding community</p>
      </div>
      
      {(error || serverError) && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error || serverError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          placeholder="johndoe"
          error={errors.username?.message}
          {...registerForm('username', { 
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            }
          })}
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...registerForm('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••••"
          error={errors.password?.message}
          {...registerForm('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••••"
          error={errors.confirmPassword?.message}
          {...registerForm('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...registerForm('role', { required: 'Please select a role' })}
          >
            <option value="viewer">Viewer (Browse Projects)</option>
            <option value="student">Student (Submit Projects)</option>
            <option value="faculty">Faculty Coordinator</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </a>
          </label>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<UserPlus size={18} />}
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;