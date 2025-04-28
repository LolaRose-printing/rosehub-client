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
        ? <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
            <table className="w-full text-sm text-white table-none md:table-auto rounded-2xl">
              <thead>
                <tr className="bg-gray-900">
                  <th className="py-4 px-12 text-left text-gray-200 font-bold uppercase">Id</th>
                  <th className="py-4 px-12 text-left text-gray-200 font-bold uppercase">Name</th>
                  <th className="py-4 px-12 text-left text-gray-200 font-bold uppercase">Value</th>
                  <th className="py-4 px-12 text-left text-gray-200 font-bold uppercase">Creation</th>
                  <th className="py-4 px-12 text-left text-gray-200 font-bold uppercase">Options</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                {tokens.map(token => {
                  const createdAt = new Date(token.createdAt);
                  const formatToken = `${token.value.slice(0, 40)}...`;
                  const formatDate = new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).format(createdAt);
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const copyToClipboard = (_evt: MouseEvent<HTMLParagraphElement>) => {
                    navigator.clipboard.writeText(token.value);
                  };

                  return (
                    <tr className="hover:bg-gray-700 text-white" key={token.id}>
                      <td className="py-4 px-12 border-b border-gray-700">
                        <p className="block font-semibold text-sm text-white">{token.id}</p>
                      </td>
                      <td className="py-4 px-12 border-b border-gray-700">
                        <p className="text-sm text-white">{token.name}</p>
                      </td>
                      <td className="py-4 px-12 border-b border-gray-700">
                        <p className="text-sm text-white" onClick={copyToClipboard}>{formatToken}</p>
                      </td>
                      <td className="py-4 px-12 border-b border-gray-700">
                        <p className="text-sm text-white">{formatDate}</p>
                      </td>
                      <td className="py-4 px-12 border-b border-gray-700">
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
            </table>
          </div>
        : <p className="font-light text-gray-400">There is not tokens so far.</p>
      }
    </div>
  );
}
