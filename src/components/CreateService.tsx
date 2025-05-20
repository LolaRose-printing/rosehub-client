import { FC } from "react";
import Link from "next/link";
import clsx from "clsx";

export const CreateService: FC = () => {
  return (
    <div>
      <Link
        type="submit"
        className={clsx(
          "transition ease-in-out duration-150 bg-[#612ad5] rounded-lg shadow-md px-6 py-3 text-sm font-bold text-white hover:bg-[#612ad5ed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
        )}
        href={"/create/service"}
      >
        Create Service
      </Link>
    </div>
  );
}
