import { FC } from "react";
import Link from "next/link";
import { TbPointFilled } from "react-icons/tb";

const options = [
  {
    name: "Api Token",
    path: "/options/tokens",
  },
];

export const Settings: FC = () => {
  return (
    <div>
      <h1 className="mb-6 text-lg font-light text-gray-200">Global Settings</h1>
      <ul className="flex flex-col bg-[#101010] py-6 h-96 w-72 text-left rounded-lg">
        {options.map((option, i) => {
          return (
            <Link key={i} href={option.path} className="transition ease-in-out duration-150 rounded-lg shadow-md px-6 py-3 text-sm font-bold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 justify-center items-center">
              <div className="flex flex-row m-auto items-center">
                <TbPointFilled />
                <li className="px-6">{option.name}</li>
              </div>
              </Link>       
            );
          })}
        </ul>
    </div>
  );
}
