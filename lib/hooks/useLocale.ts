// lib/hooks/useLocale.ts
 'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useLocale() {
  const router = useRouter();
  const [locale, setLocaleState] = useState<'ar' | 'en'>('ar');
  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');

  useEffect(() => {
    // قراءة اللغة من localStorage أو المتصفح
    const savedLocale = localStorage.getItem('locale') as 'ar' | 'en' | null;
    const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    const initialLocale = savedLocale || browserLang;
    
    setLocaleState(initialLocale);
    setDir(initialLocale === 'ar' ? 'rtl' : 'ltr');
    
    document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = initialLocale;
  }, []);

  const setLocale = (newLocale: 'ar' | 'en') => {
    setLocaleState(newLocale);
    setDir(newLocale === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('locale', newLocale);
    
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
    
    // إعادة تحميل الصفحة لتطبيق التغييرات
    router.refresh();
  };

  return { locale, dir, setLocale };
}