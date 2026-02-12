import Link from "next/link";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDatetime from "./FormattedDatetime";

const Card = ({ file }: { file: FileDocument }) => {
  console.log("File Owner Data:", file.owner);
  return (
    <Link href={file.url} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          ActionsDropdown ...
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        <FormattedDatetime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />

        <p className="caption line-clamp-1 text-light-200">
          By : {file.ownerName}
        </p>
      </div>
    </Link>
  );
};

export default Card;
