"use client";

import React, { useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Tabs,
  Tab,
  TabBody,
  Button,
  Checkbox,
} from "react95";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fieldset } from "react95";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import { withWindow, useWindowShake, useWindowManager } from "@/components/contexts/window-manager";
import { motion } from "framer-motion";

interface ConsentFormProps {
  onAccept: () => void;
  onClose?: () => void;
  className?: string;
}

const requiredTrue = z
  .boolean()
  .refine((v) => v === true, { message: "Required" });

const ConsentSchema = z.object({
  cookies: requiredTrue,
  ip: requiredTrue,
  browser: requiredTrue,
});

type ConsentFields = z.infer<typeof ConsentSchema>;

/**
 * Tiny helper for React95 sprite icons. Pass a CSS class e.g. "World_16x16_4".
 */
const R95Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
  <span className={cn(name, "inline-block w-4 h-4 bg-contain", className)} />
);

export const ConsentForm: React.FC<ConsentFormProps> = ({ onAccept, onClose, className }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const { attemptClose, unregister } = useWindowManager();
  const isShaking = useWindowShake("consent-form");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ConsentFields>({
    mode: "onChange",
    resolver: zodResolver(ConsentSchema),
    defaultValues: {},
  });

  /**
   * Persist consent acceptance (simple localStorage flag for now) and close the
   * window by unregistering it from the WindowManager. In future this can be
   * replaced with a call to the backend to persist on the user/session record.
   */
  const handleAccept = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("purity_consent", "true");
      }
    } catch (_) {
      /* ignore storage errors */
    }

    // Remove window from manager so it never shows again in this session
    unregister("consent-form");

    // Notify parent
    onAccept();
  };

  const handleCloseAttempt = () => {
    attemptClose("consent-form");
  };

  return (
    <ThemeProvider theme={original}>
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Window
          variant="outside"
          className={cn("font-home-video text-[#000]", className)}
          style={{ width: 620, backgroundColor: "#8f8f8f" }}
        >
        <WindowHeader className="flex justify-between items-center select-none">
          <span>Data & Privacy</span>
          <Button className="p-0 w-6 h-6 flex items-center justify-center" onClick={handleCloseAttempt}>
            ✕
          </Button>
        </WindowHeader>
        <WindowContent className="text-sm flex flex-col space-y-2 h-full" style={{ backgroundColor: '#d0d0d0', color: '#000' }}>
          <Tabs
            value={activeTab}
            onChange={(value: number) => setActiveTab(value)}
            className="flex gap-1 whitespace-nowrap"
          >
            <Tab value={0} className="flex items-center gap-1 px-1 py-1 text-[11px]">
              <R95Icon name="Network_16x16_4" />
              <span className="truncate">Cookies & Analytics</span>
            </Tab>
            <Tab value={1} className="flex items-center gap-1 px-1 py-1 text-[11px]">
              <R95Icon name="Password_16x16_4" />
              <span className="truncate">IP & Browser</span>
            </Tab>
            <Tab value={2} className="flex-grow flex items-center gap-1 px-1 py-1 text-[11px]">
              <R95Icon name="Computer_16x16_4" />
              <span className="truncate">Device Metadata</span>
            </Tab>
          </Tabs>

          <TabBody className="mt-2 font-home-video text-sm overflow-y-auto flex-1">
            {activeTab === 0 && (
              <div
                className="w-full space-y-3 border border-[#000] shadow-[inset_-2px_-2px_0_0_#000]"
                style={{ borderRadius: 4, backgroundColor: '#cfcfcf', padding: '0.75rem', width: '100%' }}
              >
                <p className="flex items-center gap-2">
                  <span className="Network_16x16_4 inline-block w-4 h-4 bg-contain" />
                  We use first-party cookies to maintain session state and gather anonymous analytics.
                </p>
                <label className="flex items-center gap-2 pt-2 pl-1">
                  <Checkbox
                    {...register("cookies")}
                    className="mr-1 mt-[1px]"
                    style={{ borderColor: '#5a5a5a' }}
                  />
                  <span>Accept cookies & analytics.</span>
                </label>
                {errors.cookies && (
                  <span className="text-red-600 text-xs ml-6">{errors.cookies.message}</span>
                )}
              </div>
            )}
            {activeTab === 1 && (
              <div
                className="w-full space-y-3 border border-[#000] shadow-[inset_-2px_-2px_0_0_#000]"
                style={{ borderRadius: 4, backgroundColor: '#cfcfcf', padding: '0.75rem', width: '100%' }}
              >
                <p className="flex items-center gap-2">
                  <span className="Iexplore_16x16_4 inline-block w-4 h-4 bg-contain" />
                  We log your public IP and basic browser fingerprint for security & diagnostics.
                </p>
                <label className="flex items-center gap-2 pt-2 pl-1">
                  <Checkbox
                    {...register("ip")}
                    className="mr-1 mt-[1px]"
                    style={{ borderColor: '#5a5a5a' }}
                  />
                  <span>Accept IP & browser data collection.</span>
                </label>
                {errors.ip && <span className="text-red-600 text-xs ml-6">{errors.ip.message}</span>}
              </div>
            )}
            {activeTab === 2 && (
              <div
                className="w-full space-y-3 border border-[#000] shadow-[inset_-2px_-2px_0_0_#000]"
                style={{ borderRadius: 4, backgroundColor: '#cfcfcf', padding: '0.75rem', width: '100%' }}
              >
                <p className="flex items-center gap-2">
                  <span className="Computer_16x16_4 inline-block w-4 h-4 bg-contain" />
                  We collect anonymised device metadata (screen size, OS version) to improve UX.
                </p>
                <label className="flex items-center gap-2 pt-2 pl-1">
                  <Checkbox
                    {...register("browser")}
                    className="mr-1 mt-[1px]"
                    style={{ borderColor: '#5a5a5a' }}
                  />
                  <span>Accept device metadata collection.</span>
                </label>
                {errors.browser && (
                  <span className="text-red-600 text-xs ml-6">{errors.browser.message}</span>
                )}
              </div>
            )}
          </TabBody>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleSubmit(handleAccept)}
              disabled={!isValid}
              className="font-home-video"
            >
              Continue
            </Button>
          </div>
        </WindowContent>
      </Window>
      </motion.div>
    </ThemeProvider>
  );
};

// Need to create a wrapper that uses a consistent ID
const ConsentFormWithId: React.FC<ConsentFormProps> = (props) => {
  const { register } = useWindowManager();
  
  React.useEffect(() => {
    register({
      id: "consent-form",
      title: "Data & Privacy", 
      icon: <span className="Lock_16x16_4 inline-block w-4 h-4 bg-contain" />,
      type: "system",
      closable: false,
      position: "center",
    });
  }, [register]);
  
  return <ConsentForm {...props} />;
};

export default ConsentFormWithId; 