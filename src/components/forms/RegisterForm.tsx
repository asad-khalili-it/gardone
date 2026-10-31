'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CustomerForm } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface RegisterFormProps {
  onSubmit: (data: CustomerForm) => void;
  isLoading?: boolean;
}

const PHONE_REGEX = /^09\d{9}$/;

export default function RegisterForm({
  onSubmit,
  isLoading = false,
}: RegisterFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'لطفاً نام خود را وارد کنید';
    } else if (name.trim().length < 2) {
      newErrors.name = 'نام باید حداقل ۲ حرف باشد';
    }

    if (!phone.trim()) {
      newErrors.phone = 'لطفاً شماره موبایل خود را وارد کنید';
    } else if (!PHONE_REGEX.test(phone.trim())) {
      newErrors.phone = 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name: name.trim(), phone: phone.trim() });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <div
        className="relative p-6 rounded-3xl overflow-hidden
          bg-white/5 backdrop-blur-xl border border-white/10
          shadow-2xl"
      >
        {/* Glass-morphism decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-extrabold text-center mb-1"
          >
            ✍️ ثبت‌نام کنید
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 text-sm text-center mb-6"
          >
            برای شرکت در قرعه‌کشی اطلاعات خود را وارد کنید
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="نام و نام خانوادگی"
              placeholder="مثال: علی محمدی"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <Input
              label="شماره موبایل"
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              value={phone}
              onChange={(e) => {
                // Only allow digits
                const val = e.target.value.replace(/[^0-9۰-۹]/g, '');
                // Convert Persian digits to English
                const englishVal = val.replace(/[۰-۹]/g, (d) =>
                  String.fromCharCode(d.charCodeAt(0) - 1728)
                );
                setPhone(englishVal);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              error={errors.phone}
              type="tel"
              dir="ltr"
              inputMode="numeric"
              maxLength={11}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2 text-lg"
              >
                بزن بریم! 🎯
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
