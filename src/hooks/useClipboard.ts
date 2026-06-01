import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useUiConfig } from "../ConfigProvider";

export const useClipboard = (timeout = 2000) => {
  const [hasCopied, setHasCopied] = useState(false);
  const { t } = useUiConfig();

  const onCopy = useCallback(
    async (text: string, successMsg?: string) => {
      if (!navigator?.clipboard) {
        toast.error(t("common.error"));
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setHasCopied(true);
        toast.success(successMsg || t("common.success"));

        setTimeout(() => {
          setHasCopied(false);
        }, timeout);
        return true;
      } catch (error) {
        toast.error(t("common.error"));
        return false;
      }
    },
    [timeout, t],
  );

  return { hasCopied, onCopy };
};
