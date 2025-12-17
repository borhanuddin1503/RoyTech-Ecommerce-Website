'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { LuEyeClosed, LuEye } from 'react-icons/lu';
import { FiUser, FiPhone, FiMapPin, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import SocialLogin from '../login/SocialLogin';
import register from '../actions/auth/register';
import { useRouter } from 'next/navigation';
import imageCompression from "browser-image-compression";
import Swal from 'sweetalert2';
import Image from 'next/image';


export default function SignUpPage() {
  const [showPass, setShowPass] = useState(false);
  const [PassValid, setPassValid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const router = useRouter();
  const [photoLoading, setPhotoLoading] = useState(false);

  // Primary color configuration
  const primaryColor = '#06b6d4';
  const primaryHover = '#0891b2';

  // handle password validation
  const handleChangePassword = (pass) => {
    setPassValid('');
    const regularExpression =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!regularExpression.test(pass)) {
      setPassValid('Password should contain at least one lowercase, one uppercase, and one digit (min 8 characters)');
    }
  };


  // upload images
  const uploadImage = async (file) => {
    try {
      setPhotoLoading(true)
      if (!file) return;

      const options = {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };

      console.log(file)

      const compressedImage = await imageCompression(file, options);

      // formdata
      const formData = new FormData();
      formData.append("image", compressedImage);


      // upload image and convert into webp
      const res = await fetch("/api/upload-webp-imgbb", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        return setPhoto(result.url)
      }

      return Swal.fire('Error', result.message, 'error')
    }
    finally {
      setPhotoLoading(false)
    }
  }


  // delete photos
  const handleDeletePhoto = () => {
    setPhoto('')
  }

  // handle form submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!photo) return;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (PassValid) {
      alert('please select a difficult password');
      setIsLoading(false);
      return;
    }

    // save in database
    const isRegister = await register({ ...data, image: photo });
    if (isRegister.isSuccess) {
      Swal.fire('Success', isRegister.message, 'success');
      router.push('/login');
    } else {
      Swal.fire('Error', isRegister.message, 'error');
    }
    setIsLoading(false);
    setPhoto('')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Main Card */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className='bg-[#06b6d4] py-8 text-white text-center'>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">
              Create Your Account
            </h2>
            <p className='text-white/90'>Join us for better experience</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4 px-8 py-8">
          {/* Full Name */}
          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-main" />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="Your Full Name"
                className="w-full border border-gray-300 py-3 px-10 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="h-5 w-5 text-main" />
              </div>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Your Phone Number"
                className="w-full border border-gray-300 py-3 px-10 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Thana */}
          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
              Thana *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-main" />
              </div>
              <input
                type="text"
                name="thana"
                placeholder="Your Thana"
                required
                className="w-full border border-gray-300 py-3 px-10 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* District */}
          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
              District *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-main" />
              </div>
              <input
                type="text"
                name="district"
                required
                placeholder="Your District"
                className="w-full border border-gray-300 py-3 px-10 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* photo */}
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Photo *
            </label>
            {photo ?
              <div className="mt-2 relative w-32 h-32" >
                <img
                  src={photo}
                  className="rounded-xl border w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto()}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8"
                >
                  ×
                </button>
              </div> :
              <div className='flex gap-2 border  border-gray-300 py-3 px-3 w-full borderrounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200  rounded-lg'>
                <div className="">
                  <FiUser className="h-5 w-5 text-main" />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadImage(e.target?.files[0])}
                    required
                    className="outline-none cursor-pointer"
                  />
                  {photoLoading && <p className="text-main text-sm mt-2">Uploading...</p>}
                </div>
              </div>}
          </div>

          {/* Full Address - Spanning 2 columns */}
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Address *
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-main" />
              </div>
              <textarea
                name="fullAddress"
                rows="3"
                placeholder="Enter your full address"
                className="w-full border border-gray-300 py-3 px-10 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200 outline-none resize-none"
                required
              ></textarea>
            </div>
          </div>

          {/* Email Address */}
          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-main" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                required
                className="w-full border border-gray-300 py-3 px-10 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Secondary Number */}
          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
              Secondary Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="h-5 w-5 text-main" />
              </div>
              <input
                type="tel"
                name="secondaryNumber"
                placeholder="Optional"
                className="w-full border border-gray-300 py-3 px-10 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Password - Spanning 2 columns */}
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-main" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Enter your Password"
                onChange={(e) => handleChangePassword(e.target.value)}
                required
                className="w-full border border-gray-300 py-3 px-10 pr-10 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-200 outline-none"
              />
              <div
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-all duration-200"
              >
                {showPass ?
                  <LuEye className="h-5 w-5 text-gray-500" /> :
                  <LuEyeClosed className="h-5 w-5 text-gray-500" />
                }
              </div>
            </div>
            {PassValid && (
              <p className="text-red-500 text-sm mt-2 bg-red-50 py-2 px-3 rounded border border-red-200">
                {PassValid}
              </p>
            )}
          </div>

          {/* Submit button - Spanning 2 columns */}
          <div className="col-span-2 space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#06b6d4] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#0891b2] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </span>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">or sign up with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          </div>

          {/* Social login - Spanning 2 columns */}
          <div className='col-span-2'>
            <SocialLogin />
          </div>
        </form>

        {/* Footer */}
        <div className='bg-gray-50 py-5 text-center border-t border-gray-200'>
          <span className='text-gray-600 text-sm'>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-main hover:text-[#0891b2] transition-colors duration-200"
            >
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}