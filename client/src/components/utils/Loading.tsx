import { memo } from "react";
import Skeleton from "antd/lib/skeleton";

interface LoadingProps {
  total?: number;
}

function Loading({ total = 1 }: LoadingProps) {
  return (
    <>
      {Array.from(Array(total).keys()).map((key) => (
        <Skeleton key={key} />
      ))}
    </>
  );
}

export default memo(Loading);
