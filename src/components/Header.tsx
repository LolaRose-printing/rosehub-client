"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import { Nunito } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  DisclosureButton,
  DisclosurePanel,
  Disclosure,
} from "@headlessui/react";
import { UserDropdown } from "@/components/UserDropdown";
import clsx from "clsx";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
});

const navigation = [
  { name: "Home", href: "/", },
  { name: "Services", href: "/services", },
  { name: "Orders", href: "/orders" },
  { name: "Online Printing", href: "/printing" },
  { name: "Options", href: "/options" },
];

export const Header: FC = () => {
  const pathName = usePathname();

  return (
    <Disclosure as="nav" className={clsx(nunito.className, "bg-[#1f2941]")}>
      <div className="mx-auto px-3 sm:px-6 lg:px-8 py-1">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 gap-2">
                <Image
                  alt="logo"
                  src={"/logo.png"}
                  width={350}
                  height={350}
                  className="w-20 h-20 m-auto mr-6"
                />
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={pathName === item.href ? "page" : undefined}
                    className={clsx(
                      pathName === item.href ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium m-auto",
                    )}
                  >
                    <span className="text-[18px]">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <UserDropdown />
          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={pathName === item.href ? "page" : undefined}
              className={clsx(
                pathName === item.href ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium",
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
