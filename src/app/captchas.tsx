"use client";
import "./landing-page.scss";
import { useState, useEffect, useLayoutEffect } from "react";
import { Button, Input, useToast } from "@chakra-ui/react";
import FaCaptcha from "FaCaptcha";

const ExampleImages: any = [
  {
    url: "https://images.rawpixel.com/image_1000/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjc5LTA0NS14LmpwZw.jpg",
    topics: ["Dog"],
  },
  {
    url: "https://images.rawpixel.com/image_1000/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BkMjEtNTEtMDItcm9iLmpwZw.jpg",
    topics: ["Dog"],
  },
  {
    url: "https://images.rawpixel.com/image_1000/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjc5LTA3MS14LmpwZw.jpg",
    topics: ["Hen"],
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/USAF_Afterburner_Monster_Jam.jpg/220px-USAF_Afterburner_Monster_Jam.jpg",
    topics: ["Monster truck", "Vehicle"],
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Grave_digger.JPG/220px-Grave_digger.JPG",
    topics: ["Monster truck", "Vehicle"],
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Left_side_of_Flying_Pigeon.jpg/300px-Left_side_of_Flying_Pigeon.jpg",
    topics: ["Bicycle"],
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/300px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    topics: ["Food"],
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mini_pig_2.jpg/220px-Mini_pig_2.jpg",
    topics: ["Pig"],
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/250px-GoldenGateBridge-001.jpg",
    topics: ["Golden Gate Bridge", "Bridge"],
  },
];

const TextCaptcha = ({ onVerify }: any) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      onVerify();
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
            Verify
          </Button>
        </div>
      ) : null}
    </div>
  );
};

const CellCaptcha = ({ onVerify }: any) => {
  return (
    <div className="captcha">
      <FaCaptcha
        onVerificationComplete={() => {
          onVerify();
        }}
        captchaTopics={[
          "Golden Gate Bridge",
          "Monster truck",
          "Vehicle",
          "Hen",
          "Dog",
          "Pig",
          "Food",
        ]}
        imgTopicUrls={ExampleImages}
        cellsWide={3}
        allowRetry
        simulateSlow={0}
      />
    </div>
  );
};

export { TextCaptcha, CellCaptcha };
