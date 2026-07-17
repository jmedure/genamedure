"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Toast } from "./Toast";

type ContactProps = {
  email: string;
  tiktokHandle: string;
  tiktokUrl: string;
};

export function Contact({ email, tiktokHandle, tiktokUrl }: ContactProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setToastVisible(true);
    } catch {
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setToastVisible(true);
    }
  }, [email]);

  const hideToast = useCallback(() => setToastVisible(false), []);

  return (
    <section className="w-full px-2.5 pb-6">
      <div className="relative flex w-full max-w-[381px] flex-col gap-[42px]">
        <div className="relative inline-block w-fit">
          <h2 className="font-display text-[50px] leading-none text-black">
            Contact
          </h2>
          <Image
            src="/images/scribbles/contact.svg"
            alt=""
            width={143}
            height={52}
            className="pointer-events-none absolute -right-36 -top-5"
            aria-hidden
          />
        </div>

        <div className="flex flex-col gap-2.5 font-body text-2xl tracking-[-0.12px] text-black">
          <button
            type="button"
            onClick={copyEmail}
            className="w-full text-left transition-opacity duration-200 hover:opacity-60"
          >
            {email}
          </button>
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-200 hover:opacity-60"
          >
            {tiktokHandle}
          </a>
        </div>
      </div>

      <Toast
        message="Copied email"
        visible={toastVisible}
        onHide={hideToast}
      />
    </section>
  );
}
