import { AccountContext } from "@/contexts/AccountContext";
import React, { useContext } from "react";
import { useRouter } from "next/router";
function ClearCacheLink(props) {
  const { successClear, clearCache } = props;
  const [state] = useContext(AccountContext);
  const router = useRouter()
  const keyword = router.query.keyword;
  const encodedKeyword = encodeURIComponent(keyword);

  return (
    <span>
      {window.config["site-url"] === "https://www.ishtari.com" && (
        <>
          {state?.admin && !successClear && (
            <a
              className="px-12 text-dblue pointer-events-auto cursor-pointer"
              onClick={() => clearCache()}
            >
              clear cache
            </a>
          )}
          {successClear && (
            <a
              href={window.location.href}
              className="px-12 text-dblue pointer-events-auto"
              target="_blank"
            >
              {encodedKeyword.replace("%20", " ")}
            </a>
          )}
        </>
      )}
    </span>
  );
}

export default ClearCacheLink;
