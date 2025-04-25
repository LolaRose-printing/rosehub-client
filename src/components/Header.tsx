"use client";

import { FC, MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  DisclosureButton,
  DisclosurePanel,
  Disclosure,
  Menu,
} from "@headlessui/react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useStore } from "zustand";
import clsx from "clsx";

const navigation = [
  { name: "Home", href: "/", },
  { name: "Services", href: "/services", },
  { name: "Orders", href: "/orders" },
  { name: "Online Printing", href: "/printing" },
  { name: "Options", href: "/options" },
];

export const Header: FC = () => {
  const pathName = usePathname();
  const email = useStore(useAuthStore, (state) => state.email);
  const { logout } = useAuthStore();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSignOut = (_evt: MouseEvent<HTMLElement>) => {
    logout();
    router.push("/auth");
  };

  return (
    <Disclosure as="nav" className="bg-gray-100 dark:bg-gray-800">
      <div className="mx-auto  px-3 sm:px-6 lg:px-8 py-1">
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
                      pathName === item.href ? "bg-gray-400 dark:bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium m-auto",
                    )}
                  >
                    <span className="text-[18px]">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="m-auto absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <p className="ml-3">{email}</p>
            <Menu as="div" className="relative ml-3">
              <Link
                href=""
                onClick={handleSignOut}
                className={clsx("bg-gray-400 dark:bg-gray-700 text-white rounded-md px-3 py-3 text-sm font-medium")}
              >
                <span className="text-[18px]">Sign out</span>
              </Link>
            </Menu>
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
