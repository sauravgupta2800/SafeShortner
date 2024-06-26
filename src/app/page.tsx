"use client";
import "./landing-page.scss";
import { useState, useRef } from "react";
import { Button, Divider, Input, useToast } from "@chakra-ui/react";
import { StarIcon, ArrowRightIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { experiences } from "./config";
import CollapseRow from "./collapse";

export default function Index() {
  const onShorten = (url: string) => {
    console.log("onShorten");
  };

  return (
    <main className="home">
      <div className="home__info w-80 flex flex-col items-center justify-center">
        <h1 className="home__info__title">Shorten. Secure. Share</h1>

        <h2 className="home__info__subtitle">
          SafeShortner goes{" "}
          <b className="markHighlight">beyond URL shortening</b>. Create{" "}
          <b className="markHighlight">personalized links</b> for free, add
          security layers like{" "}
          <b className="markHighlight">passcodes and CAPTCHA</b>, and set
          expiration dates. Share confidently, knowing your content is
          safeguarded.
        </h2>
      </div>
      <MainInput onShorten={(url: string) => onShorten(url)} />

      <div className="flex w-5/6 mx-auto">
        <CollapseRow />
      </div>

      <ReviewCards />
    </main>
  );
}

const MainInput = ({ handleChange, handleOnClick }: any) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element
  const toast = useToast();

  const handleOnShorten = () => {
    console.log("originalUrl: ", inputValue);

    if (!inputValue) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    const isValidUrl = validateUrl(inputValue);
    if (!isValidUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      // Your logic to handle valid URL
      // For example, shorten the URL
    }
  };

  const validateUrl = (value: string) => {
    // Basic URL validation
    const urlPattern = /^(ftp|http[s]?):\/\/[^ "]+$/; // Making 's' optional with [s]?
    const urlWithoutProtocolPattern =
      /^[^ :\/?#]+(?:\.[^ :\/?#]+)+(?:\/[^ ?#]*)?(?:\?[^ #]*)?(?:#[^ ]*)?$/; // Regex for URLs without protocol
    return urlPattern.test(value) || urlWithoutProtocolPattern.test(value); // Check if URL matches either pattern
  };

  return (
    <div className="flex w-5/6 mx-auto my-16">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e: any) => setInputValue(e.target.value)}
        placeholder="Enter a link to shortnen and secured it"
        size="lg"
        autoFocus
        colorScheme="blue"
        borderLeftRadius="10px"
        borderRightRadius="0"
        border="2px solid #093666"
        height="60px"
        _hover={{
          border: "2px solid #093666",
        }}
      />
      <Button
        colorScheme="blue"
        size="lg"
        rightIcon={<ChevronRightIcon fontSize={"30px"} />}
        borderLeftRadius="0"
        borderRightRadius="10px"
        background="#093666"
        height="60px"
        onClick={() => handleOnShorten()}
      >
        Shorten URL
      </Button>
    </div>
  );
};

const ReviewCards = () => {
  return (
    <div className="flex flex-wrap p-6">
      {experiences.map((experience, index) => (
        <div className="ps-8 pe-8 pb-8 w-1/2" key={index}>
          <ReviewCard info={experience} />
        </div>
      ))}
    </div>
  );
};
const ReviewCard = ({ info = {} }) => {
  const { title = "", review = "", name = "", role = "" }: any = info;
  return (
    <div className="reviewcard">
      <div className="mb-4">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            w={6}
            h={6}
            color="yellow.300"
            className={index ? "ml-3" : ""}
          />
        ))}
      </div>
      <div className="font-bold italic text-xl">{title}</div>
      <div className="italic text-lg">{`"${review}"`}</div>

      <div className="w-full text-left	 text-base font-bold mt-3">{`-${name}`}</div>
      <div className="w-full text-left	 text-base text-righ">{role}</div>

      <Divider className="mt-4" />
    </div>
  );
};
