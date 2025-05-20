import { FC } from "react";
import Link from "next/link";
import clsx from "clsx";

export const CreateToken: FC = () => {
  return (
    <div>
      <Link
        type="submit"
        className={clsx(
          "transition ease-in-out duration-150 bg-[#612ad5] hover:bg-[#612ad5ed] rounded-lg shadow-md px-6 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
        )}
        href={"/create/token"}
      >
        Create Token
      </Link>
    </div>
  );
}
