/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

interface ContactFormProps {
  onSubmit: (data: any) => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  message: string;
}

const ErrorMessage = ({ message }: { message?: string }) => (
  message ? <span className="text-red-500 text-[11px] mt-0.5 ml-1">{message}</span> : null
);

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onFormSubmit = (data: FormValues) => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    onSubmit(data);
  };



  return (
    <div className="flex w-full max-w-[334px] flex-col items-start gap-2.5 rounded-[14px] bg-transparent">
      <h3 className="text-[#1A1A1A] text-[16px] font-semibold leading-[150%] mb-1">
        Contact Details:
      </h3>

      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full flex flex-col gap-2.5">
        <div className="flex gap-2.5 w-full">
          <div className="flex-1">
            <label className="text-[#292E38] text-[14px] font-normal leading-[150%] mb-1 block">
              First Name:
            </label>
            <input 
              {...register("firstName", { required: "Name is required" })}
              placeholder="Name..." 
              disabled={isSubmitted}
              className={`w-full p-[8px_14px] rounded-md bg-[#EFF1F4] border-none text-[14px] text-[#292E38] outline-none placeholder:text-[#9CA6BB] placeholder:italic disabled:opacity-70 ${errors.firstName ? 'ring-1 ring-red-400' : ''}`} 
            />
            <ErrorMessage message={errors.firstName?.message} />
          </div>
          <div className="flex-1">
            <label className="text-[#292E38] text-[14px] font-normal leading-[150%] mb-1 block">
              Last Name:
            </label>
            <input 
              {...register("lastName")}
              placeholder="Name..." 
              disabled={isSubmitted}
              className={`w-full p-[8px_14px] rounded-md bg-[#EFF1F4] border-none text-[14px] text-[#292E38] outline-none placeholder:text-[#9CA6BB] placeholder:italic disabled:opacity-70`} 
            />
          </div>
        </div>

        <div className="w-full">
          <label className="text-[#292E38] text-[14px] font-normal leading-[150%] mb-1 block">
            Contact Number:
          </label>
          <input 
            {...register("phone", { required: "Phone is required" })}
            placeholder="Type your phone number..." 
            disabled={isSubmitted}
            className={`w-full p-[8px_14px] rounded-md bg-[#EFF1F4] border-none text-[14px] text-[#292E38] outline-none placeholder:text-[#9CA6BB] placeholder:italic disabled:opacity-70 ${errors.phone ? 'ring-1 ring-red-400' : ''}`} 
          />
          <ErrorMessage message={errors.phone?.message} />
        </div>

        <div className="w-full">
          <label className="text-[#292E38] text-[14px] font-normal leading-[150%] mb-1 block">
            Email Address:
          </label>
          <input 
            {...register("email", { required: "Email is required" })}
            type="email" 
            placeholder="Type your email address..." 
            disabled={isSubmitted}
            className={`w-full p-[8px_14px] rounded-md bg-[#EFF1F4] border-none text-[14px] text-[#292E38] outline-none placeholder:text-[#9CA6BB] placeholder:italic disabled:opacity-70 ${errors.email ? 'ring-1 ring-red-400' : ''}`} 
          />
          <ErrorMessage message={errors.email?.message} />
        </div>

        <div className="w-full">
          <label className="text-[#292E38] text-[14px] font-normal leading-[150%] mb-1 block">
            Service Address:
          </label>
          <input 
            {...register("address", { required: "Address is required" })}
            placeholder="Type address..." 
            disabled={isSubmitted}
            className={`w-full p-[8px_14px] rounded-md bg-[#EFF1F4] border-none text-[14px] text-[#292E38] outline-none placeholder:text-[#9CA6BB] placeholder:italic disabled:opacity-70 ${errors.address ? 'ring-1 ring-red-400' : ''}`} 
          />
          <ErrorMessage message={errors.address?.message} />
        </div>

        <div className="w-full">
          <label className="text-[#292E38] text-[14px] font-normal leading-[150%] mb-1 block">
            Message:
          </label>
          <textarea 
            {...register("message", { required: "Message is required" })}
            placeholder="Type your message here..." 
            disabled={isSubmitted}
            className={`w-full p-[8px_14px] rounded-md bg-[#EFF1F4] border-none text-[14px] text-[#292E38] outline-none placeholder:text-[#9CA6BB] placeholder:italic h-20 resize-none disabled:opacity-70 ${errors.message ? 'ring-1 ring-red-400' : ''}`} 
          />
          <ErrorMessage message={errors.message?.message} />
        </div>

        <button 
          type="submit"
          disabled={isSubmitted}
          className={`flex p-[8px_18px] justify-center items-center gap-2.5 self-stretch rounded-lg text-white text-[14px] font-normal leading-[140%] border-none mt-1 transition-all ${isSubmitted ? 'bg-green-600' : 'bg-[#2185D0] cursor-pointer hover:bg-[#1a6fb0] active:scale-[0.98]'}`}
        >
          {isSubmitted ? 'Submitted' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

