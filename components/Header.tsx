import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";

const Header = ({
  userId,
  accountId,
  fullName,
  avatar,
}: {
  userId: string;
  accountId: string;
  fullName: string;
  avatar: string;
}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader
          ownerId={userId}
          accountId={accountId}
          fullName={fullName}
          avatar={avatar}
        />
        <form>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={20}
              height={20}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
