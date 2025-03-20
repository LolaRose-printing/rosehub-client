import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";

export const CreateToken: FC = () => {
  return (
    <div>
      <Link
        type="submit"
        className={clsx(
          "transition ease-in-out duration-150 bg-dark dark:bg-gray-900 rounded-lg shadow-md px-6 py-3 text-sm font-bold text-gray-800 dark:text-white hover:dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
        )}
        href={"/create/token"}
      >
        Create Token
      </Link>
    </div>
  );
}
