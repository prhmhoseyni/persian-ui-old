"use client";

import { Button } from "@repo/ui/button";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import BottomSheet from "../components/BottomSheet";
import MyButton from "../components/Button";
import Modal from "../components/Modal";
import Switch from "../components/Switch";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.page}>
      <h1 className="text-3xl font-bold underline text-amber-500">Hello world!</h1>

      <div className="flex flex-wrap gap-5">
        <Switch color="brand" />
        <Switch color="danger" />
        <Switch color="gray" />
        <Switch color="info" />
        <Switch color="success" />
        <Switch color="warning" />
        <Switch size="sm" />
        <Switch size="md" />
        <Switch size="lg" />
        <Switch disabled />
        <Switch isLoading />
      </div>

      <MyButton variant="contained" onClick={() => setIsOpen(true)}>بازم کن</MyButton>
      <MyButton variant="contained" onClick={() => setIsModalOpen(true)}>modal</MyButton>
      <MyButton variant="contained" onClick={() => setIsOpen(true)} fullWidth>
        بازم کن
      </MyButton>

      <BottomSheet title="This is a test bottom sheet" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BottomSheet.Body>
          <ul>
            <li>start</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>123456789</li>
            <li>end</li>
          </ul>
        </BottomSheet.Body>
      </BottomSheet>

      <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}>
        <p>this is a test modal</p>
        <p>Lorem ipsum dolor sit amet, voluptates iure quia, sint dignissimos iste. Aperiam, dignissimos corrupti?</p>
      
        <div className="flex gap-3 w-full">
          <MyButton color="brand" className="flex-1">ok</MyButton>
          <MyButton variant="tinted" color="gray" className="flex-1" onClick={() => setIsModalOpen(false)}>close</MyButton>
        </div>
      </Modal>

      <main className={styles.main}>
        <ThemeImage className={styles.logo} srcLight="turborepo-dark.svg" srcDark="turborepo-light.svg" alt="Turborepo logo" width={180} height={38} priority />
        <ol>
          <li>
            Get started by editing <code>apps/web/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image className={styles.logo} src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
            Deploy now
          </a>
          <a href="https://turborepo.com/docs?utm_source" target="_blank" rel="noopener noreferrer" className={styles.secondary}>
            Read our docs
          </a>
        </div>
        <Button appName="web" className={styles.secondary}>
          Open alert
        </Button>
      </main>
      <footer className={styles.footer}>
        <a href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a href="https://turborepo.com?utm_source=create-turbo" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to turborepo.com →
        </a>
      </footer>
    </div>
  );
}
