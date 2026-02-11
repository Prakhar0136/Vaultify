import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";

const Page = async ({ params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";

  const files = await getFiles();

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total : <span className="h5">0mb</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort By:</p>
            <Sort />
          </div>
        </div>
      </section>

      {files.total > 0 ? (
        <section className="file-list">
          {files.rows.map((file: FileDocument) => (
            <h1 className="h1" key={file.$id}>
              <Card key={file.$id} file={file} />
            </h1>
          ))}
        </section>
      ) : (
        <p className="empty-list">No files Uploaded</p>
      )}
    </div>
  );
};

export default Page;
