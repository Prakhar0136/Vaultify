import React from "react";

const Card = ({ file }: { file: FileDocument }) => {
  return <div>{file.name}</div>;
};

export default Card;
