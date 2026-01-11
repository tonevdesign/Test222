'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* GRID — XS centered, SM+ normal */}
        <div
          className="
            grid grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-4 
            gap-8 mb-12
            text-center sm:text-left
          "
        >
          {/* Brand Section */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-28 h-10 mx-auto sm:mx-0">
                <Image
                  src="/logo/logo-white.png"
                  alt="Footer Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 280px"
                />
              </div>
            </div>

            <p className="text-[#A8FFF5] text-sm mb-6 max-w-xs mx-auto sm:mx-0">
              Онлайн магазин с внимателно подбрани продукти и обслужване, на което можете да разчитате.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <a href="#" className="p-2 bg-[#333333] hover:bg-[#00BFA6] rounded-lg transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-[#333333] hover:bg-[#00BFA6] rounded-lg transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-[#333333] hover:bg-[#00BFA6] rounded-lg transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-bold text-white mb-4">За клиента</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-[#A8FFF5] hover:text-[#00BFA6] text-sm">
                  Информация за доставка
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-[#A8FFF5] hover:text-[#00BFA6] text-sm">
                  Връщане и замяна
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-bold text-white mb-4">Условия</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-[#A8FFF5] hover:text-[#00BFA6] text-sm">
                  Поверителност и сигурност
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#A8FFF5] hover:text-[#00BFA6] text-sm">
                  Общи условия
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[#A8FFF5] hover:text-[#00BFA6] text-sm">
                  Бисквитки
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-bold text-white mb-4">Полезно</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?sort=newest" className="text-[#A8FFF5] hover:text-[#00BFA6] text-sm">
                  Нови продукти
                </Link>
              </li>
              <li>
                <Link href="/products?sort=sale" className="text-[#A8FFF5] hover:text-[#00BFA6] text-sm">
                  Промоции
                </Link>
              </li>
              <li>
                <Link href="/products?recommended=true" className="text-[#A8FFF5] hover:text-[#00BFA6] text-sm">
                  Избрани за Вас
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#333333] pt-8 mb-8">
          <h3 className="font-bold text-white mb-4 text-center sm:text-left">
            Връзка с нас
          </h3>

          <div
            className="
              grid grid-cols-1 
              sm:grid-cols-3
              gap-6 
              text-center sm:text-left
            "
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <Mail size={20} className="text-[#00BFA6]" />
              <div>
                <p className="text-[#777777] text-sm">Имейл</p>
                <span className="text-[#00BFA6]">support@zekto.com</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <Phone size={20} className="text-[#00BFA6]" />
              <div>
                <p className="text-[#777777] text-sm">Телефон</p>
                <span className="text-[#00BFA6]">+359 888 202 487</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <MapPin size={20} className="text-[#00BFA6]" />
              <div>
                <p className="text-[#777777] text-sm">Адрес</p>
                <p className="text-[#00BFA6]">Хасково, пл. Свобода 1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#333333] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[#777777] text-sm">
            © 2025 Zekto.bg. Всички права запазени.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0F0F0F] border-t border-[#333333]">
        <div
          className="
            container mx-auto px-4 sm:px-6 lg:px-8 py-4 
            flex flex-col sm:flex-row 
            justify-between items-center 
            text-sm text-[#777777]
            text-center sm:text-left
            gap-4
          "
        >
          <p>Безплатна доставка за поръчки над 100 €</p>
          <p>14 дневен срок за връщане</p>
          <p>Гарантирано качество</p>
        </div>
      </div>
    </footer>
  );
}