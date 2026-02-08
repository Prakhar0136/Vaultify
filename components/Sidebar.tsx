"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: Props) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="lg:w-full -ml-2 -mt-2 block">
        <Image
          src="/assets/icons/logo.png"
          alt="logo"
          width={150}
          height={80}
          className="hidden h-auto lg:block"
        />

        <Image
          src="/assets/icons/logo.png"
          alt="logo"
          width={100}
          height={100}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav -mt-42">
        <ul className="flex flex-col gap-4">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url}>
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  width={24}
                  height={24}
                  alt={name}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active",
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={300}
        height={300}
        className="w-full"
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />

        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
