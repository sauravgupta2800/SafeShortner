"use client";
import "./landing-page.scss";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Button, Input, useToast } from "@chakra-ui/react";
// import { StarIcon, ArrowRightIcon } from "@chakra-ui/icons";
// import { experiences } from "./config";
// import { error } from "console";

const TextCaptcha = () => {
  const [inputValue, setInputValue] = useState("");
  const [render, setRender] = useState(false);
  const [ReactCaptcha, setReactCaptcha] = useState(null as any);
  const toast = useToast();

  useLayoutEffect(() => {
    async function loadModule() {
      setReactCaptcha(await import("react-simple-captcha"));
    }
    loadModule();
  }, []);

  useLayoutEffect(() => {
    if (ReactCaptcha) {
      setRender(true);
    }
  }, [ReactCaptcha]);

  useEffect(() => {
    if (render) {
      setTimeout(() => {
        ReactCaptcha.loadCaptchaEnginge(
          6,
          "#07090e",
          "rgb(0, 200, 0)",
          "default"
        );
      }, 250);
    }
  }, [render]);

  const handleSubmit = () => {
    console.log("handleSubmit");

    if (!ReactCaptcha.validateCaptcha(inputValue, false)) {
      toast({
        title: "Mismatch Capatha Value",
        description: "Please enter a captcha value",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      //valid
    }
  };

  return (
    <div className="captcha">
      {render ? (
        <div>
          <ReactCaptcha.LoadCanvasTemplate />
          <Input
            value={inputValue}
            onChange={(e: any) => setInputValue(e.target.value)}
            placeholder="Enter Captcha Value"
            size="md"
            className="mt-2"
          />
          <Button
            className="mt-8"
            colorScheme="blue"
            size="md"
            background="#093666"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export { TextCaptcha };
