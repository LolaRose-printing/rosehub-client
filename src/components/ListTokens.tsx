"use client";

import { FC, MouseEvent } from "react";
import { Token } from "@/types/token";

type Props = {
  tokens: Token[];
};

export const ListTokens: FC<Readonly<Props>> = ({ tokens }: Readonly<Props>) => {
  return (
    <div className="mt-6">
      {tokens.length
        ? <div className="relative flex flex-col w-full h-full text-gray-700 bg-white dark:text-white dark:bg-[#101010] shadow-md rounded-2xl bg-clip-border"><table className="w-full text-sm text-gray-500 dark:text-white table-none md:table-fixed rounded-2xl">
        <thead>
        <tr className="border-b border-gray-900 bg-slate-50 dark:bg-[#101010] rounded-full">
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Id</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Name</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Value</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Creation</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Options</th>
        </tr>
        </thead>
        <tbody>
        {tokens.map(token => {
          const createdAt = new Date(token.created_at);
          const formatToken = `${token.value.slice(0, 40)}...`;
          const formatDate = `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const copyToClipboard = (_evt: MouseEvent<HTMLParagraphElement>) => {
            navigator.clipboard.writeText(token.value);
          };

          return (
            <tr className="hover:bg-slate-50 dark:hover:bg-gray-900" key={token.id}>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="block font-semibold text-sm text-slate-800 dark:text-white">{token.id}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="text-sm text-slate-500 dark:text-white">{token.name}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="text-sm text-slate-500 dark:text-white" onClick={copyToClipboard}>{formatToken}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="text-sm text-slate-500 dark:text-white">{formatDate}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <button type="button" className="text-slate-500 hover:text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </td>
        </tr>
          );
        })}
        </tbody>
      </table></div>
        : <p className="font-light text-gray-400">There is not tokens so far.</p>
      }
    </div>
  );
}
